// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title SameloPoints
 * @notice On-chain points ledger. Users call earn() to receive 10 points.
 *         Points can be redeemed for $MELO tokens via redeem().
 *         A per-wallet cooldown prevents spam on earn().
 */
contract SameloPoints is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ── Constants ─────────────────────────────────────────────────────────────
    uint256 public constant POINTS_PER_EARN = 10;
    uint256 public constant EARN_COOLDOWN   = 1 hours;

    // ── State ─────────────────────────────────────────────────────────────────
    mapping(address => uint256) public points;
    mapping(address => uint256) public lastEarnedAt;
    uint256 public totalPointsIssued;
    uint256 public totalPointsRedeemed;

    IERC20  public meloToken;
    /// @dev MELO amount per point, scaled by 1e18. Default: 1 MELO per point.
    uint256 public meloRate = 1e18;

    // ── Events ────────────────────────────────────────────────────────────────
    event PointsEarned(
        address indexed user,
        uint256 amount,
        uint256 newTotal,
        uint256 timestamp
    );
    event PointsRedeemed(
        address indexed user,
        uint256 pointsAmount,
        uint256 meloAmount
    );
    event MeloTokenSet(address indexed token);
    event MeloRateSet(uint256 rate);

    // ── Errors ────────────────────────────────────────────────────────────────
    error CooldownActive(uint256 availableAt);
    error InsufficientPoints();
    error MeloNotConfigured();
    error InsufficientMeloReserve();

    constructor(address initialOwner) Ownable(initialOwner) {}

    // ── User actions ──────────────────────────────────────────────────────────

    /**
     * @notice Earn POINTS_PER_EARN points for the caller.
     *         Reverts if called within EARN_COOLDOWN of the last earn.
     */
    function earn() external {
        uint256 availableAt = lastEarnedAt[msg.sender] + EARN_COOLDOWN;
        if (block.timestamp < availableAt) revert CooldownActive(availableAt);

        lastEarnedAt[msg.sender] = block.timestamp;
        points[msg.sender]      += POINTS_PER_EARN;
        totalPointsIssued       += POINTS_PER_EARN;

        emit PointsEarned(msg.sender, POINTS_PER_EARN, points[msg.sender], block.timestamp);
    }

    /**
     * @notice Redeem points for $MELO tokens.
     * @param pointsAmount Number of points to redeem.
     */
    function redeem(uint256 pointsAmount) external nonReentrant {
        if (address(meloToken) == address(0)) revert MeloNotConfigured();
        if (points[msg.sender] < pointsAmount) revert InsufficientPoints();

        uint256 meloAmount = (pointsAmount * meloRate) / 1e18;
        if (meloToken.balanceOf(address(this)) < meloAmount) revert InsufficientMeloReserve();

        points[msg.sender]  -= pointsAmount;
        totalPointsRedeemed += pointsAmount;
        meloToken.safeTransfer(msg.sender, meloAmount);

        emit PointsRedeemed(msg.sender, pointsAmount, meloAmount);
    }

    // ── Owner setters ─────────────────────────────────────────────────────────

    function setMeloToken(address token) external onlyOwner {
        meloToken = IERC20(token);
        emit MeloTokenSet(token);
    }

    /// @param rate New MELO/point rate scaled by 1e18 (e.g., 1e18 = 1 MELO per point).
    function setMeloRate(uint256 rate) external onlyOwner {
        meloRate = rate;
        emit MeloRateSet(rate);
    }

    function withdrawMelo(address to, uint256 amount) external onlyOwner {
        meloToken.safeTransfer(to, amount);
    }

    // ── Views ─────────────────────────────────────────────────────────────────

    function getPoints(address user) external view returns (uint256) {
        return points[user];
    }

    /**
     * @notice Seconds until the user can earn again. 0 means ready now.
     */
    function cooldownRemaining(address user) external view returns (uint256) {
        uint256 availableAt = lastEarnedAt[user] + EARN_COOLDOWN;
        if (block.timestamp >= availableAt) return 0;
        return availableAt - block.timestamp;
    }

    /**
     * @notice Preview how many MELO tokens a points amount redeems to.
     */
    function meloForPoints(uint256 pointsAmount) external view returns (uint256) {
        return (pointsAmount * meloRate) / 1e18;
    }
}

