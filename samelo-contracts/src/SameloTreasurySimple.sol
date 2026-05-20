// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SameloTreasurySimple
 * @notice Simple on-chain treasury: deposit revenue, release rewards.
 *         No oracle signatures - admin releases rewards directly.
 * @dev Celo Mainnet (Chain ID: 42220)
 *      CELO: 0x471EcE3750Da237f93B8E339c536989b8978a438
 */
contract SameloTreasurySimple is ReentrancyGuard, Pausable, Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable celoToken;

    uint256 public totalDeposited;
    uint256 public totalPaidOut;
    uint256 public reserveBalance;
    uint256 public rewardPoolBalance;
    uint256 public reserveRatio;
    uint256 public constant MAX_RESERVE_RATIO = 3000; // 30%

    event RevenueDeposited(
        address indexed depositor,
        uint256 totalAmount,
        uint256 toPool,
        uint256 toReserve,
        uint256 timestamp
    );

    event RewardPaid(address indexed user, uint256 amount, uint256 timestamp);
    event ReserveWithdrawn(address indexed to, uint256 amount);
    event ReserveRatioUpdated(uint256 oldRatio, uint256 newRatio);

    constructor(
        address _celoToken,
        uint256 _reserveRatio
    ) Ownable(msg.sender) {
        require(_celoToken != address(0), "zero celoToken");
        require(_reserveRatio <= MAX_RESERVE_RATIO, "ratio too high");

        celoToken = IERC20(_celoToken);
        reserveRatio = _reserveRatio;
    }

    /**
     * @notice Deposit ad revenue. Splits into reserve + reward pool.
     */
    function depositRevenue(uint256 amount)
        external
        whenNotPaused
        nonReentrant
    {
        require(amount > 0, "zero amount");
        celoToken.safeTransferFrom(msg.sender, address(this), amount);

        uint256 toReserve = (amount * reserveRatio) / 10_000;
        uint256 toPool = amount - toReserve;

        totalDeposited += amount;
        reserveBalance += toReserve;
        rewardPoolBalance += toPool;

        emit RevenueDeposited(msg.sender, amount, toPool, toReserve, block.timestamp);
    }

    /**
     * @notice Release CELO reward to user. Owner/admin calls directly.
     */
    function releaseReward(address user, uint256 amount)
        external
        onlyOwner
        whenNotPaused
        nonReentrant
    {
        require(user != address(0), "zero user");
        require(amount > 0, "zero amount");
        require(rewardPoolBalance >= amount, "pool insufficient");

        rewardPoolBalance -= amount;
        totalPaidOut += amount;
        celoToken.safeTransfer(user, amount);

        emit RewardPaid(user, amount, block.timestamp);
    }

    /**
     * @notice Batch release rewards (admin convenience).
     */
    function batchReleaseRewards(
        address[] calldata users,
        uint256[] calldata amounts
    ) external onlyOwner whenNotPaused nonReentrant {
        require(users.length == amounts.length, "length mismatch");

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        require(rewardPoolBalance >= totalAmount, "pool insufficient");

        rewardPoolBalance -= totalAmount;
        totalPaidOut += totalAmount;

        for (uint256 i = 0; i < users.length; i++) {
            require(users[i] != address(0), "zero user");
            celoToken.safeTransfer(users[i], amounts[i]);
            emit RewardPaid(users[i], amounts[i], block.timestamp);
        }
    }

    function setReserveRatio(uint256 bps) external onlyOwner {
        require(bps <= MAX_RESERVE_RATIO, "ratio too high");
        uint256 old = reserveRatio;
        reserveRatio = bps;
        emit ReserveRatioUpdated(old, bps);
    }

    function withdrawReserve(address to, uint256 amount)
        external
        onlyOwner
        nonReentrant
    {
        require(to != address(0), "zero address");
        require(amount > 0, "zero amount");
        require(reserveBalance >= amount, "reserve insufficient");

        reserveBalance -= amount;
        celoToken.safeTransfer(to, amount);

        emit ReserveWithdrawn(to, amount);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function getStatus()
        external
        view
        returns (
            uint256 poolBalance,
            uint256 reserveBal,
            uint256 totalIn,
            uint256 totalOut
        )
    {
        return (rewardPoolBalance, reserveBalance, totalDeposited, totalPaidOut);
    }
}
