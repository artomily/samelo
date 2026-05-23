// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {SameloPoints} from "../src/SameloPoints.sol";

/**
 * @title DeployPoints
 * @notice Deploy SameloPoints to any Celo network.
 *
 * Usage (Celo Sepolia testnet):
 *   forge script script/DeployPoints.s.sol:DeployPoints \
 *     --rpc-url https://celo-sepolia.drpc.org \
 *     --broadcast \
 *     -vvv
 *
 * Environment:
 *   PRIVATE_KEY — deployer private key (hex, with 0x prefix)
 */
contract DeployPoints is Script {
    function run() public {
        uint256 deployerPk = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPk);

        console.log("-----------------------------------------------------------");
        console.log("Deploying SameloPoints");
        console.log("-----------------------------------------------------------");

        SameloPoints pts = new SameloPoints();

        console.log("[SUCCESS] SameloPoints deployed:", address(pts));
        console.log("  POINTS_PER_EARN :", pts.POINTS_PER_EARN());
        console.log("  EARN_COOLDOWN   :", pts.EARN_COOLDOWN(), "seconds");

        vm.stopBroadcast();
    }
}
