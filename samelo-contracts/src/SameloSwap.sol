// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "./interfaces/ITreasury.sol";

/**
 * @title SameloSwap
 * @notice Points-to-CELO swap contract for the Samelo Watch-to-Earn protocol.
 *         Users accumulate off-chain points that can be redeemed for CELO in a
 *         single silent transaction — no multi-step approval required.
 *
 * @dev UUPS upgradeable — rate, limits, and signature logic can be patched
 *      without losing state or changing the contract address.
 *      Celo Mainnet (Chain ID: 42220)
 *      CELO ERC-20 wrapper: 0x471EcE3750Da237f93B8E339c536989b8978a438
 */
contract SameloSwap is
    Initializable,
    UUPSUpgradeable,
    AccessControlUpgradeable,
    ReentrancyGuard,
    PausableUpgradeable
{
    using SafeERC20 for IERC20;
    using ECDSA for bytes32;

    // ─────────────────────────────────────────────────────────────────────────
    // State
    // ─────────────────────────────────────────────────────────────────────────

    IERC20 public celoToken;
    address public treasury;
    address public oracle;
    uint256 public pointsToCELORate;
    uint256 public minSwapPoints;
    uint256 public maxSwapPoints;
    uint256 public swapCooldown;
    mapping(address => uint256) public lastSwapTime;
    mapping(bytes32 => bool) public usedNonces;

    // ─────────────────────────────────────────────────────────────────────────
    // Initializer
    // ─────────────────────────────────────────────────────────────────────────

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address _celoToken,
        address _treasury,
        address _oracle,
        uint256 _pointsToCELORate,
        uint256 _minSwapPoints,
        uint256 _maxSwapPoints,
        uint256 _swapCooldown
    ) public initializer {
        __AccessControl_init();
        __Pausable_init();

        require(_celoToken != address(0), "Swap: zero celoToken");
        require(_treasury != address(0), "Swap: zero treasury");
        require(_oracle != address(0), "Swap: zero oracle");
        require(_pointsToCELORate > 0, "Swap: zero rate");
        require(_minSwapPoints > 0, "Swap: zero minSwapPoints");
        require(_maxSwapPoints > _minSwapPoints, "Swap: max <= min");

        celoToken = IERC20(_celoToken);
        treasury = _treasury;
        oracle = _oracle;
        pointsToCELORate = _pointsToCELORate;
        minSwapPoints = _minSwapPoints;
        maxSwapPoints = _maxSwapPoints;
        swapCooldown = _swapCooldown;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // UUPS Upgrade
    // ─────────────────────────────────────────────────────────────────────────

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(DEFAULT_ADMIN_ROLE)
    {}

    // ─────────────────────────────────────────────────────────────────────────
    // Events
    // ─────────────────────────────────────────────────────────────────────────

    event PointsSwapped(
        address indexed user,
        uint256 pointsConsumed,
        uint256 celoReceived,
        bytes32 nonce,
        uint256 timestamp
    );

    event RateUpdated(uint256 oldRate, uint256 newRate);
    event SwapLimitsUpdated(uint256 min, uint256 max);
    event CooldownUpdated(uint256 newCooldown);
    event OracleUpdated(address newOracle);
    event TreasuryUpdated(address newTreasury);

    // ─────────────────────────────────────────────────────────────────────────
    // Core Swap
    // ─────────────────────────────────────────────────────────────────────────

    function swapPoints(
        uint256 pointAmount,
        bytes32 nonce,
        bytes calldata signature
    ) external nonReentrant whenNotPaused {
        require(pointAmount >= minSwapPoints, "Swap: below minimum");
        require(pointAmount <= maxSwapPoints, "Swap: above maximum");

        require(!usedNonces[nonce], "Swap: nonce already used");

        require(
            block.timestamp >= lastSwapTime[msg.sender] + swapCooldown,
            "Swap: cooldown active"
        );

        _verifySignature(msg.sender, pointAmount, nonce, signature);

        usedNonces[nonce] = true;
        lastSwapTime[msg.sender] = block.timestamp;

        uint256 celoAmount = _calculateCELO(pointAmount);

        require(
            ITreasury(treasury).getRewardPoolBalance() >= celoAmount,
            "Swap: treasury pool insufficient"
        );

        ITreasury(treasury).releaseForSwap(address(this), celoAmount);
        celoToken.safeTransfer(msg.sender, celoAmount);

        emit PointsSwapped(msg.sender, pointAmount, celoAmount, nonce, block.timestamp);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Rate Calculation
    // ─────────────────────────────────────────────────────────────────────────

    function _calculateCELO(uint256 points) internal view returns (uint256 celoWei) {
        return points * pointsToCELORate;
    }

    function previewSwap(uint256 pointAmount) external view returns (uint256 celoAmount) {
        return _calculateCELO(pointAmount);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Internal Signature Verification
    // ─────────────────────────────────────────────────────────────────────────

    function _verifySignature(
        address user,
        uint256 pointAmount,
        bytes32 nonce,
        bytes calldata signature
    ) internal view {
        bytes32 hash = keccak256(
            abi.encodePacked(user, pointAmount, nonce, address(this))
        );
        bytes32 ethHash = MessageHashUtils.toEthSignedMessageHash(hash);
        address signer = ECDSA.recover(ethHash, signature);
        require(signer == oracle, "Swap: invalid oracle signature");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Admin Controls
    // ─────────────────────────────────────────────────────────────────────────

    function setPointsToCELORate(uint256 newRate) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newRate > 0, "Swap: zero rate");
        uint256 old = pointsToCELORate;
        pointsToCELORate = newRate;
        emit RateUpdated(old, newRate);
    }

    function setSwapLimits(uint256 _min, uint256 _max) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_min > 0, "Swap: zero min");
        require(_max > _min, "Swap: max <= min");
        minSwapPoints = _min;
        maxSwapPoints = _max;
        emit SwapLimitsUpdated(_min, _max);
    }

    function setSwapCooldown(uint256 seconds_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        swapCooldown = seconds_;
        emit CooldownUpdated(seconds_);
    }

    function setOracle(address newOracle) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newOracle != address(0), "Swap: zero address");
        oracle = newOracle;
        emit OracleUpdated(newOracle);
    }

    function setTreasury(address newTreasury) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newTreasury != address(0), "Swap: zero address");
        treasury = newTreasury;
        emit TreasuryUpdated(newTreasury);
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function rescueTokens(
        address token,
        address to,
        uint256 amount
    ) external onlyRole(DEFAULT_ADMIN_ROLE) nonReentrant {
        require(token != address(celoToken), "Swap: cannot rescue CELO");
        require(to != address(0), "Swap: zero recipient");
        IERC20(token).safeTransfer(to, amount);
    }
}
