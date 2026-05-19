// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @title SemeloRewardPool
 * @notice Pull-based cUSD reward pool for Semelo Watch-to-Earn.
 *
 * Flow:
 *   1. Ad revenue funds this contract with cUSD (off-chain → on-chain conversion).
 *   2. Off-chain oracle tracks watch events and computes claimable amounts.
 *   3. Oracle signs keccak256(abi.encodePacked(user, amount, nonce)) off-chain.
 *   4. User calls claim() with amount + nonce + signature — no oracle gas spend.
 *   5. Contract verifies signature, increments nonce (replay protection), transfers cUSD.
 *
 * Deploy on Celo Mainnet (Chain ID: 42220).
 * cUSD: 0x765DE816845861e75A25fCA122bb6898B8B1282a
 */
contract SemeloRewardPool {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    IERC20 public immutable cusd;
    address public immutable oracle;

    /// @notice Per-user claim nonce — prevents signature replay
    mapping(address => uint256) public nonces;

    event Claimed(address indexed user, uint256 amount, uint256 nonce);
    event PoolFunded(address indexed funder, uint256 amount);

    error InvalidSignature();
    error InvalidNonce();
    error InsufficientPool();

    constructor(address _cusd, address _oracle) {
        require(_cusd != address(0) && _oracle != address(0), "Zero address");
        cusd = IERC20(_cusd);
        oracle = _oracle;
    }

    /**
     * @notice Claim earned cUSD rewards.
     * @param amount     Amount in cUSD wei (18 decimals)
     * @param nonce      Must equal nonces[msg.sender]
     * @param signature  Oracle's ECDSA signature over keccak256(user, amount, nonce)
     */
    function claim(
        uint256 amount,
        uint256 nonce,
        bytes calldata signature
    ) external {
        if (nonce != nonces[msg.sender]) revert InvalidNonce();

        bytes32 hash = keccak256(
            abi.encodePacked(msg.sender, amount, nonce)
        ).toEthSignedMessageHash();

        address signer = hash.recover(signature);
        if (signer != oracle) revert InvalidSignature();

        if (cusd.balanceOf(address(this)) < amount) revert InsufficientPool();

        nonces[msg.sender]++;

        emit Claimed(msg.sender, amount, nonce);

        // Transfer after state update (checks-effects-interactions)
        require(cusd.transfer(msg.sender, amount), "Transfer failed");
    }

    /// @notice Current cUSD balance of the reward pool
    function poolBalance() external view returns (uint256) {
        return cusd.balanceOf(address(this));
    }

    /// @notice Accept direct cUSD funding — anyone can top up the pool
    function fund(uint256 amount) external {
        require(
            cusd.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        emit PoolFunded(msg.sender, amount);
    }
}
