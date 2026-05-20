// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @title SameloTreasury
 * @notice Central fund manager for the Samelo Watch-to-Earn protocol.
 *         Receives ad revenue in CELO, splits it into reward pool and
 *         protocol reserve, and releases funds to users or the swap contract.
 * @dev Celo Mainnet (Chain ID: 42220)
 *      CELO ERC-20 wrapper: 0x471EcE3750Da237f93B8E339c536989b8978a438
 */
contract SameloTreasury is ReentrancyGuard, Pausable, AccessControl {
    using SafeERC20 for IERC20;
    using ECDSA for bytes32;

    // ─────────────────────────────────────────────────────────────────────────
    // Roles
    // ─────────────────────────────────────────────────────────────────────────

    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");
    bytes32 public constant SWAP_ROLE = keccak256("SWAP_ROLE");

    // ─────────────────────────────────────────────────────────────────────────
    // State
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice CELO ERC-20 wrapper token
    IERC20 public immutable celoToken;

    /// @notice Address of the authorized revenue depositor / reward signer
    address public oracle;

    /// @notice Address of the authorized reward distributor
    address public rewardDistributor;

    /// @notice Address of the authorized SameloSwap contract
    address public swapContract;

    /// @notice Lifetime CELO received
    uint256 public totalDeposited;

    /// @notice Lifetime CELO paid out
    uint256 public totalPaidOut;

    /// @notice Protocol reserve balance
    uint256 public reserveBalance;

    /// @notice Available CELO for rewards and swaps
    uint256 public rewardPoolBalance;

    /// @notice Reserve split ratio in basis points (e.g. 1000 = 10%)
    uint256 public reserveRatio;

    /// @notice Maximum allowed reserveRatio (30%)
    uint256 public constant MAX_RESERVE_RATIO = 3000;

    /// @notice Global nonce registry — prevents replay of reward actions
    mapping(bytes32 => bool) public usedNonces;

    // ─────────────────────────────────────────────────────────────────────────
    // Events
    // ─────────────────────────────────────────────────────────────────────────

    event RevenueDeposited(
        address indexed depositor,
        uint256 totalAmount,
        uint256 toPool,
        uint256 toReserve,
        uint256 timestamp
    );

    event RewardActionExecuted(
        address indexed user,
        uint256 amount,
        uint8 actionType, // 0=watch 1=checkin 2=referral 3=streak
        bytes32 nonce,
        uint256 timestamp
    );

    event RewardReleased(address indexed user, uint256 amount);
    event SwapFundsReleased(address indexed recipient, uint256 amount);
    event ReserveWithdrawn(address indexed to, uint256 amount);
    event ReserveRatioUpdated(uint256 oldRatio, uint256 newRatio);
    event OracleUpdated(address newOracle);
    event RewardDistributorUpdated(address newDistributor);
    event SwapContractUpdated(address newSwap);

    // ─────────────────────────────────────────────────────────────────────────
    // Constructor
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @param _celoToken        CELO ERC-20 wrapper address
     * @param _oracle           Initial oracle (revenue depositor + reward signer)
     * @param _rewardDistributor Initial reward distributor address
     * @param _reserveRatio     Initial reserve ratio in basis points (≤ 3000)
     */
    constructor(
        address _celoToken,
        address _oracle,
        address _rewardDistributor,
        uint256 _reserveRatio
    ) {
        require(_celoToken != address(0), "Treasury: zero celoToken");
        require(_oracle != address(0), "Treasury: zero oracle");
        require(_rewardDistributor != address(0), "Treasury: zero distributor");
        require(_reserveRatio <= MAX_RESERVE_RATIO, "Treasury: ratio too high");

        celoToken = IERC20(_celoToken);
        oracle = _oracle;
        rewardDistributor = _rewardDistributor;
        reserveRatio = _reserveRatio;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ORACLE_ROLE, _oracle);
        _grantRole(DISTRIBUTOR_ROLE, _rewardDistributor);
        // swapContract is set later via setSwapContract()
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Revenue Intake
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Oracle deposits ad revenue in CELO. Automatically splits into
     *         reward pool and protocol reserve according to reserveRatio.
     * @param amount Amount of CELO to deposit (must be pre-approved)
     */
    function depositRevenue(uint256 amount)
        external
        onlyRole(ORACLE_ROLE)
        whenNotPaused
        nonReentrant
    {
        require(amount > 0, "Treasury: zero amount");
        celoToken.safeTransferFrom(msg.sender, address(this), amount);
        totalDeposited += amount;
        _splitRevenue(amount);
        uint256 toReserve = (amount * reserveRatio) / 10_000;
        uint256 toPool = amount - toReserve;
        emit RevenueDeposited(msg.sender, amount, toPool, toReserve, block.timestamp);
    }

    /**
     * @dev Splits deposited amount: reserveRatio% → reserve, rest → rewardPool.
     */
    function _splitRevenue(uint256 amount) internal {
        uint256 toReserve = (amount * reserveRatio) / 10_000;
        uint256 toPool = amount - toReserve;
        reserveBalance += toReserve;
        rewardPoolBalance += toPool;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Fund Release
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Release a CELO reward directly to a specific user.
     * @dev Called by the rewardDistributor only. For standard payout flows.
     * @param user   Recipient wallet
     * @param amount CELO amount in wei
     */
    function releaseReward(address user, uint256 amount)
        external
        onlyRole(DISTRIBUTOR_ROLE)
        whenNotPaused
        nonReentrant
    {
        require(user != address(0), "Treasury: zero user");
        require(amount > 0, "Treasury: zero amount");
        require(rewardPoolBalance >= amount, "Treasury: pool insufficient");

        rewardPoolBalance -= amount;
        totalPaidOut += amount;
        celoToken.safeTransfer(user, amount);

        emit RewardReleased(user, amount);
    }

    /**
     * @notice Release CELO to the swap contract for points redemption.
     * @dev Called by SameloSwap only.
     * @param recipient Address to receive the funds (typically SameloSwap itself)
     * @param amount    CELO amount in wei
     */
    function releaseForSwap(address recipient, uint256 amount)
        external
        onlyRole(SWAP_ROLE)
        whenNotPaused
        nonReentrant
    {
        require(recipient != address(0), "Treasury: zero recipient");
        require(amount > 0, "Treasury: zero amount");
        require(rewardPoolBalance >= amount, "Treasury: pool insufficient");

        rewardPoolBalance -= amount;
        totalPaidOut += amount;
        celoToken.safeTransfer(recipient, amount);

        emit SwapFundsReleased(recipient, amount);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Silent Background TX — Single Entry Point
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Unified function: verifies user action, releases CELO reward,
     *         and records the event on-chain — all in one transaction.
     *         Triggered silently by the frontend when the user performs any
     *         earn action (watch, check-in, referral, streak).
     *
     * @dev The backend oracle pre-signs the payload. The frontend submits a
     *      single transaction — no multi-step UX needed.
     *
     *      Flow (CEI pattern):
     *        1. Check nonce has not been used
     *        2. Verify oracle ECDSA signature over (user, amount, actionType, nonce, address(this))
     *        3. Mark nonce as used
     *        4. Verify pool has sufficient funds
     *        5. Deduct from pool and increment totalPaidOut
     *        6. Transfer CELO to user
     *        7. Emit RewardActionExecuted
     *
     * @param user       Wallet receiving the reward
     * @param amount     CELO reward amount in wei
     * @param actionType Action category: 0=watch, 1=checkin, 2=referral, 3=streak
     * @param nonce      Unique per-action nonce (prevents replay)
     * @param signature  Oracle ECDSA signature over the payload
     */
    function executeRewardAction(
        address user,
        uint256 amount,
        uint8 actionType,
        bytes32 nonce,
        bytes calldata signature
    ) external nonReentrant whenNotPaused {
        require(user != address(0), "Treasury: zero user");
        require(amount > 0, "Treasury: zero amount");

        // 1. Nonce check (before any state change)
        require(!usedNonces[nonce], "Treasury: nonce already used");

        // 2. Signature verification
        _verifyOracleSignature(user, amount, actionType, nonce, signature);

        // 3. Mark nonce (effects)
        usedNonces[nonce] = true;

        // 4. Pool balance check
        require(rewardPoolBalance >= amount, "Treasury: pool insufficient");

        // 5. Effects
        rewardPoolBalance -= amount;
        totalPaidOut += amount;

        // 6. Interaction
        celoToken.safeTransfer(user, amount);

        // 7. Event
        emit RewardActionExecuted(user, amount, actionType, nonce, block.timestamp);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Internal Helpers
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @dev Verifies that `signature` is a valid oracle signature over the
     *      packed payload. Includes address(this) to prevent cross-contract
     *      replay attacks.
     */
    function _verifyOracleSignature(
        address user,
        uint256 amount,
        uint8 actionType,
        bytes32 nonce,
        bytes calldata signature
    ) internal view {
        bytes32 hash = keccak256(
            abi.encodePacked(user, amount, actionType, nonce, address(this))
        );
        bytes32 ethHash = MessageHashUtils.toEthSignedMessageHash(hash);
        address signer = ECDSA.recover(ethHash, signature);
        require(signer == oracle, "Treasury: invalid oracle signature");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Admin Controls
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Update the reserve split ratio.
     * @param bps New ratio in basis points (max 3000 = 30%)
     */
    function setReserveRatio(uint256 bps)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(bps <= MAX_RESERVE_RATIO, "Treasury: ratio too high");
        uint256 old = reserveRatio;
        reserveRatio = bps;
        emit ReserveRatioUpdated(old, bps);
    }

    /**
     * @notice Replace the oracle address. Atomically revokes the old role
     *         and grants the role to the new address.
     * @param newOracle New oracle address
     */
    function setOracle(address newOracle) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newOracle != address(0), "Treasury: zero address");
        _revokeRole(ORACLE_ROLE, oracle);
        oracle = newOracle;
        _grantRole(ORACLE_ROLE, newOracle);
        emit OracleUpdated(newOracle);
    }

    /**
     * @notice Replace the reward distributor. Atomically revokes the old role
     *         and grants the role to the new address.
     * @param dist New distributor address
     */
    function setRewardDistributor(address dist) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(dist != address(0), "Treasury: zero address");
        _revokeRole(DISTRIBUTOR_ROLE, rewardDistributor);
        rewardDistributor = dist;
        _grantRole(DISTRIBUTOR_ROLE, dist);
        emit RewardDistributorUpdated(dist);
    }

    /**
     * @notice Set the SameloSwap contract address. Atomically manages the
     *         SWAP_ROLE. Can only be set once with a non-zero prior address
     *         (handled: revokeRole on zero-address is a no-op in OZ v5).
     * @param swap New swap contract address
     */
    function setSwapContract(address swap) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(swap != address(0), "Treasury: zero address");
        if (swapContract != address(0)) {
            _revokeRole(SWAP_ROLE, swapContract);
        }
        swapContract = swap;
        _grantRole(SWAP_ROLE, swap);
        emit SwapContractUpdated(swap);
    }

    /**
     * @notice Withdraw funds from the protocol reserve to a given address.
     * @param to     Recipient address
     * @param amount Amount of CELO in wei
     */
    function withdrawReserve(address to, uint256 amount)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
        nonReentrant
    {
        require(to != address(0), "Treasury: zero address");
        require(amount > 0, "Treasury: zero amount");
        require(reserveBalance >= amount, "Treasury: reserve insufficient");

        reserveBalance -= amount;
        celoToken.safeTransfer(to, amount);

        emit ReserveWithdrawn(to, amount);
    }

    /// @notice Pause all fund-moving operations.
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    /// @notice Resume all fund-moving operations.
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // View Functions
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice Returns current reward pool balance available for rewards/swaps.
    function getRewardPoolBalance() external view returns (uint256) {
        return rewardPoolBalance;
    }

    /// @notice Returns current protocol reserve balance.
    function getReserveBalance() external view returns (uint256) {
        return reserveBalance;
    }

    /**
     * @notice Returns a snapshot of all key accounting totals.
     * @return deposited  Lifetime CELO deposited
     * @return paidOut    Lifetime CELO paid out
     * @return reserve    Current reserve balance
     * @return pool       Current reward pool balance
     */
    function getTotalStats()
        external
        view
        returns (
            uint256 deposited,
            uint256 paidOut,
            uint256 reserve,
            uint256 pool
        )
    {
        return (totalDeposited, totalPaidOut, reserveBalance, rewardPoolBalance);
    }

    /**
     * @notice Returns whether a nonce has already been consumed.
     * @param nonce The nonce to query
     */
    function isNonceUsed(bytes32 nonce) external view returns (bool) {
        return usedNonces[nonce];
    }
}
