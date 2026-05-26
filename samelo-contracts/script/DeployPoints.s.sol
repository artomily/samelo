// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {SameloPoints} from "../src/SameloPoints.sol";

/**
 * @title DeployPoints
 * @notice Deploy SameloPoints as a UUPS proxy to any Celo network.
 *
 * Usage (Celo Sepolia):
 *   forge script script/DeployPoints.s.sol:DeployPoints \
 *     --rpc-url https://celo-sepolia.drpc.org \
 *     --broadcast -vvv
 *
 * Environment:
 *   PRIVATE_KEY — deployer private key (hex, with 0x prefix)
 */
contract DeployPoints is Script {
    function run() public {
        uint256 deployerPk = vm.envUint("PRIVATE_KEY");
        address deployer    = vm.addr(deployerPk);
        vm.startBroadcast(deployerPk);

        console.log("-----------------------------------------------------------");
        console.log("Deploying SameloPoints (UUPS Proxy)");
        console.log("-----------------------------------------------------------");

        SameloPoints ptsImpl = new SameloPoints();
        console.log("[1/2] Implementation deployed:", address(ptsImpl));

        bytes memory initData = abi.encodeCall(SameloPoints.initialize, (deployer));
        ERC1967Proxy proxy = new ERC1967Proxy(address(ptsImpl), initData);
        SameloPoints pts = SameloPoints(payable(address(proxy)));
        console.log("[2/2] Proxy deployed:        ", address(pts));

        console.log("");
        console.log("POINTS_PER_EARN :", pts.POINTS_PER_EARN());
        console.log("earnCooldown    :", pts.earnCooldown(), "seconds");
        console.log("");
        console.log("=== Points Address ===");
        console.log("NEXT_PUBLIC_POINTS_ADDRESS=", address(pts));

        vm.stopBroadcast();
    }
}
