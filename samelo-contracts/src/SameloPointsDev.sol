// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title SameloPointsDev
 * @notice Dev-only SameloPoints with ZERO cooldown for testing.
 *         Otherwise identical to SameloPoints.
 */
contract SameloPointsDev is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    uint256 public constant POINTS_PER_EARN = 10;
    uint256 public constant EARN_COOLDOWN   = 0; // no cooldown for test

    mapping(address => uint256) public points;
    mapping(address => uint256) public lastEarnedAt;
    uint256 public totalPointsIssued;
    uint256 public totalPointsRedeemed;

    IERC20  public meloToken;
    uint256 public meloRate = 1_000_000_000_000_000_000_000_000_000_000_000;

    event PointsEarned(address indexed user, uint256 amount, uint256 newTotal, uint256 timestamp);
    event PointsRedeemed(address indexed user, uint256 pointsAmount, uint256 meloAmount);
    event MeloTokenSet(address indexed token);
    event MeloRateSet(uint256 rate);

    error CooldownActive(uint256 availableAt);
    error InsufficientPoints();
    error MeloNotConfigured();
    error InsufficientMeloReserve();

    constructor(address initialOwner) Ownable(initialOwner) {}

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
