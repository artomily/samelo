// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/SameloToken.sol";
import "../src/SameloPoints.sol";

/**
 * @notice Deploy SameloToken (MELO) + SameloPoints, wire them together,
 *         and seed 1M MELO as the rewards reserve.
 *
 * Usage (Celo Sepolia):
 *   forge script script/DeployMelo.s.sol --rpc-url $CELO_RPC_URL \
 *     --private-key $PRIVATE_KEY --broadcast --verify
 */
contract DeployMelo is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployer    = vm.addr(deployerKey);

        vm.startBroadcast(deployerKey);

        // 1. Deploy $MELO ERC-20 — 100M minted to deployer
        SameloToken melo = new SameloToken(deployer);
        console2.log("SameloToken ($MELO) deployed:", address(melo));

        // 2. Deploy SameloPoints with Ownable
        SameloPoints pts = new SameloPoints(deployer);
        console2.log("SameloPoints deployed:        ", address(pts));

        // 3. Wire: tell SameloPoints which token to distribute
        pts.setMeloToken(address(melo));

        // 4. Seed 1M MELO into SameloPoints as the rewards reserve
        uint256 reserve = 1_000_000 * 1e18;
        melo.transfer(address(pts), reserve);
        console2.log("Seeded 1M MELO into SameloPoints reserve");

        vm.stopBroadcast();

        console2.log("\n=== Deployment Summary ===");
        console2.log("NEXT_PUBLIC_MELO_ADDRESS=", address(melo));
        console2.log("NEXT_PUBLIC_POINTS_ADDRESS=", address(pts));
        console2.log("==========================");
    }
}
