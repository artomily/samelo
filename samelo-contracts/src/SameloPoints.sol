// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SameloPoints
 * @notice On-chain points ledger. Users call earn() to receive 10 points.
 *         Points can be redeemed for $MELO tokens via redeem().
 *         A per-wallet cooldown prevents spam on earn().
 *
 * @dev UUPS upgradeable — points state survives across upgrades.
 */
contract SameloPoints is
    Initializable,
    UUPSUpgradeable,
    OwnableUpgradeable,
    ReentrancyGuard
{
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
    /// @dev MELO amount per point, scaled by 1e18.
    ///      Rate: 1000 points = 1 $MELOUSD  →  meloRate = 1e33
    uint256 public meloRate = 1_000_000_000_000_000_000_000_000_000_000_000;

    // ── Initializer ───────────────────────────────────────────────────────────

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address initialOwner) public initializer {
        __Ownable_init(initialOwner);
    }

    // ── UUPS Upgrade ──────────────────────────────────────────────────────────

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyOwner
    {}

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

    // ── User actions ──────────────────────────────────────────────────────────

    function earn() external {
        uint256 availableAt = lastEarnedAt[msg.sender] + EARN_COOLDOWN;
        if (block.timestamp < availableAt) revert CooldownActive(availableAt);

        lastEarnedAt[msg.sender] = block.timestamp;
        points[msg.sender]      += POINTS_PER_EARN;
        totalPointsIssued       += POINTS_PER_EARN;

        emit PointsEarned(msg.sender, POINTS_PER_EARN, points[msg.sender], block.timestamp);
    }

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

    function cooldownRemaining(address user) external view returns (uint256) {
        uint256 availableAt = lastEarnedAt[user] + EARN_COOLDOWN;
        if (block.timestamp >= availableAt) return 0;
        return availableAt - block.timestamp;
    }

    function meloForPoints(uint256 pointsAmount) external view returns (uint256) {
        return (pointsAmount * meloRate) / 1e18;
    }
}
