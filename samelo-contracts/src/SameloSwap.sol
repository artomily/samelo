// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "./interfaces/ITreasury.sol";

/**
 * @title SameloSwap
 * @notice Points-to-CELO swap contract for the Samelo Watch-to-Earn protocol.
 *         Users accumulate off-chain points that can be redeemed for CELO in a
 *         single silent transaction — no multi-step approval required.
 *
 * @dev Swap flow:
 *        1. User taps "Swap Points → CELO" in the frontend
 *        2. Backend oracle pre-signs the payload
 *        3. Frontend submits a single swapPoints() transaction
 *        4. Contract verifies signature, checks cooldown and limits
 *        5. Pulls CELO from SameloTreasury into this contract
 *        6. Transfers CELO directly to the user wallet
 *        7. Marks nonce as used and emits PointsSwapped
 *
 *      Celo Mainnet (Chain ID: 42220)
 *      CELO ERC-20 wrapper: 0x471EcE3750Da237f93B8E339c536989b8978a438
 */
contract SameloSwap is ReentrancyGuard, Pausable, AccessControl {
    using SafeERC20 for IERC20;
    using ECDSA for bytes32;

    // ─────────────────────────────────────────────────────────────────────────
    // Roles
    // ─────────────────────────────────────────────────────────────────────────

    // DEFAULT_ADMIN_ROLE from AccessControl is the sole admin role.

    // ─────────────────────────────────────────────────────────────────────────
    // State
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice CELO ERC-20 wrapper token
    IERC20 public immutable celoToken;

    /// @notice SameloTreasury contract address
    address public treasury;

    /// @notice Oracle signer that authorises swap requests
    address public oracle;

    /// @notice CELO wei awarded per 1 point (e.g. 1e13 = 0.00001 CELO/point)
    uint256 public pointsToCELORate;

    /// @notice Minimum points required per swap transaction
    uint256 public minSwapPoints;

    /// @notice Maximum points allowed per swap transaction
    uint256 public maxSwapPoints;

    /// @notice Minimum time between swaps for a single user (seconds)
    uint256 public swapCooldown;

    /// @notice Timestamp of last successful swap per user
    mapping(address => uint256) public lastSwapTime;

    /// @notice Consumed swap nonces — prevents replay attacks
    mapping(bytes32 => bool) public usedNonces;

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
    // Constructor
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @param _celoToken        CELO ERC-20 wrapper address
     * @param _treasury         SameloTreasury contract address
     * @param _oracle           Oracle signer wallet
     * @param _pointsToCELORate CELO wei per 1 point (e.g. 1e13)
     * @param _minSwapPoints    Minimum points per swap (e.g. 500)
     * @param _maxSwapPoints    Maximum points per swap (e.g. 50000)
     * @param _swapCooldown     Cooldown between swaps in seconds (e.g. 86400)
     */
    constructor(
        address _celoToken,
        address _treasury,
        address _oracle,
        uint256 _pointsToCELORate,
        uint256 _minSwapPoints,
        uint256 _maxSwapPoints,
        uint256 _swapCooldown
    ) {
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
    // Core Swap — 1 Button Silent Flow
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Swap off-chain points for CELO in a single transaction.
     *         Called silently by the frontend when the user taps the swap button.
     *         No approval flow needed — the oracle pre-signs the payload.
     *
     * @dev    Flow (CEI pattern):
     *           1. Validate pointAmount bounds
     *           2. Check nonce has not been used
     *           3. Check user cooldown has elapsed
     *           4. Verify oracle ECDSA signature
     *           5. Mark nonce and update lastSwapTime (effects)
     *           6. Calculate celoAmount
     *           7. Check treasury pool has sufficient funds
     *           8. Pull CELO from treasury into this contract (Treasury → Swap)
     *           9. Transfer CELO to user (Swap → User)
     *          10. Emit PointsSwapped
     *
     * @param pointAmount Number of off-chain points to redeem
     * @param nonce       Unique swap nonce provided by the oracle
     * @param signature   Oracle ECDSA signature authorising this specific swap
     */
    function swapPoints(
        uint256 pointAmount,
        bytes32 nonce,
        bytes calldata signature
    ) external nonReentrant whenNotPaused {
        // 1. Bounds validation
        require(pointAmount >= minSwapPoints, "Swap: below minimum");
        require(pointAmount <= maxSwapPoints, "Swap: above maximum");

        // 2. Nonce check
        require(!usedNonces[nonce], "Swap: nonce already used");

        // 3. Cooldown check
        require(
            block.timestamp >= lastSwapTime[msg.sender] + swapCooldown,
            "Swap: cooldown active"
        );

        // 4. Signature verification
        _verifySignature(msg.sender, pointAmount, nonce, signature);

        // 5. Effects
        usedNonces[nonce] = true;
        lastSwapTime[msg.sender] = block.timestamp;

        // 6. Rate calculation
        uint256 celoAmount = _calculateCELO(pointAmount);

        // 7. Treasury pool check
        require(
            ITreasury(treasury).getRewardPoolBalance() >= celoAmount,
            "Swap: treasury pool insufficient"
        );

        // 8. Pull CELO from treasury into this contract
        ITreasury(treasury).releaseForSwap(address(this), celoAmount);

        // 9. Forward CELO to user
        celoToken.safeTransfer(msg.sender, celoAmount);

        // 10. Event
        emit PointsSwapped(msg.sender, pointAmount, celoAmount, nonce, block.timestamp);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Rate Calculation
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @dev Converts a point amount to CELO wei using the current rate.
     *      e.g. pointsToCELORate = 1e13 → 1000 points × 1e13 = 1e16 wei = 0.01 CELO
     */
    function _calculateCELO(uint256 points) internal view returns (uint256 celoWei) {
        return points * pointsToCELORate;
    }

    /**
     * @notice Preview how much CELO a given number of points would yield.
     * @param pointAmount Points to preview
     * @return celoAmount Estimated CELO in wei
     */
    function previewSwap(uint256 pointAmount) external view returns (uint256 celoAmount) {
        return _calculateCELO(pointAmount);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Internal Signature Verification
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @dev Verifies the oracle signature over (user, pointAmount, nonce, address(this)).
     *      Binding address(this) prevents cross-contract replay attacks — a signature
     *      valid on SameloSwap cannot be replayed on SameloTreasury and vice-versa.
     */
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

    /**
     * @notice Update the CELO wei awarded per point.
     * @param newRate New rate in CELO wei per 1 point
     */
    function setPointsToCELORate(uint256 newRate) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newRate > 0, "Swap: zero rate");
        uint256 old = pointsToCELORate;
        pointsToCELORate = newRate;
        emit RateUpdated(old, newRate);
    }

    /**
     * @notice Update the minimum and maximum points per swap.
     * @param _min New minimum (must be > 0)
     * @param _max New maximum (must be > _min)
     */
    function setSwapLimits(uint256 _min, uint256 _max) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_min > 0, "Swap: zero min");
        require(_max > _min, "Swap: max <= min");
        minSwapPoints = _min;
        maxSwapPoints = _max;
        emit SwapLimitsUpdated(_min, _max);
    }

    /**
     * @notice Update the cooldown period between swaps for a single user.
     * @param seconds_ New cooldown in seconds (0 disables cooldown)
     */
    function setSwapCooldown(uint256 seconds_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        swapCooldown = seconds_;
        emit CooldownUpdated(seconds_);
    }

    /**
     * @notice Replace the oracle signer address.
     * @param newOracle New oracle wallet address
     */
    function setOracle(address newOracle) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newOracle != address(0), "Swap: zero address");
        oracle = newOracle;
        emit OracleUpdated(newOracle);
    }

    /**
     * @notice Replace the treasury contract address.
     * @param newTreasury New SameloTreasury address
     */
    function setTreasury(address newTreasury) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newTreasury != address(0), "Swap: zero address");
        treasury = newTreasury;
        emit TreasuryUpdated(newTreasury);
    }

    /// @notice Pause swapping.
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    /// @notice Resume swapping.
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @notice Recover ERC-20 tokens accidentally sent to this contract.
     * @dev Explicitly forbidden for the active CELO token to prevent draining
     *      funds during an in-flight swap flow.
     * @param token  Token contract address to rescue
     * @param to     Recipient
     * @param amount Amount to rescue
     */
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
