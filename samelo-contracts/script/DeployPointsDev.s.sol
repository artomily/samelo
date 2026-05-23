// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {SameloPointsDev} from "../src/SameloPointsDev.sol";
import {SameloToken} from "../src/SameloToken.sol";

/**
 * @notice Deploy SameloPointsDev (zero cooldown) + wire to existing $MELO token.
 */
contract DeployPointsDev is Script {
    address constant EXISTING_MELO = 0x45dd5B746490f93c90Ea5c21212c25C72160BEe5;

    function run() public {
        uint256 deployerPk = vm.envUint("PRIVATE_KEY");
        address deployer    = vm.addr(deployerPk);

        vm.startBroadcast(deployerPk);

        SameloPointsDev pts = new SameloPointsDev(deployer);
        console.log("SameloPointsDev (0 cooldown):", address(pts));

        // Wire to existing $MELO token
        pts.setMeloToken(EXISTING_MELO);

        // Seed 1M MELO from deployer
        SameloToken melo = SameloToken(EXISTING_MELO);
        uint256 reserve = 1_000_000 * 1e18;
        melo.transfer(address(pts), reserve);
        console.log("Seeded 1M MELO + wired");

        vm.stopBroadcast();

        console.log("");
        console.log("=== DEV POINTS ADDRESS ===");
        console.log("NEXT_PUBLIC_POINTS_ADDRESS=", address(pts));
    }
}
