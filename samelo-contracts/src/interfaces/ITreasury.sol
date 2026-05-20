// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title ITreasury
/// @notice Interface for interacting with SameloTreasury from SameloSwap
interface ITreasury {
    /// @notice Release CELO to the swap contract for points redemption
    /// @param recipient Address to receive the CELO (typically SameloSwap itself)
    /// @param amount CELO amount in wei
    function releaseForSwap(address recipient, uint256 amount) external;

    /// @notice Returns the available CELO balance in the reward pool
    function getRewardPoolBalance() external view returns (uint256);
}
