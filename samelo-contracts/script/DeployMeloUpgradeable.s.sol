// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "../src/SameloToken.sol";
import "../src/SameloPoints.sol";

/**
 * @title DeployMeloUpgradeable
 * @notice Deploy SameloToken (immutable) + SameloPoints (UUPS proxy), wire them together,
 *         and seed 1M MELO as the rewards reserve.
 *
 * Usage (Celo Sepolia):
 *   PRIVATE_KEY=0x... \
 *   forge script script/DeployMeloUpgradeable.s.sol:DeployMeloUpgradeable \
 *     --rpc-url $CELO_RPC_URL \
 *     --broadcast -vvv
 */
contract DeployMeloUpgradeable is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployer    = vm.addr(deployerKey);

        vm.startBroadcast(deployerKey);

        // 1. Deploy $MELO ERC-20 — immutable, 100M minted to deployer
        SameloToken melo = new SameloToken(deployer);
        console2.log("[1/5] SameloToken ($MELO) deployed:", address(melo));

        // 2. Deploy Points implementation
        SameloPoints ptsImpl = new SameloPoints();
        console2.log("[2/5] SameloPoints impl deployed:  ", address(ptsImpl));

        // 3. Deploy Points proxy + initialize
        bytes memory ptsInit = abi.encodeCall(SameloPoints.initialize, (deployer));
        ERC1967Proxy ptsProxy = new ERC1967Proxy(address(ptsImpl), ptsInit);
        SameloPoints pts = SameloPoints(payable(address(ptsProxy)));
        console2.log("[3/5] SameloPoints proxy deployed: ", address(pts));

        // 4. Wire: tell SameloPoints which token to distribute
        pts.setMeloToken(address(melo));
        console2.log("[4/5] MELO token wired to Points");

        // 5. Seed 1M MELO into SameloPoints as the rewards reserve
        uint256 reserve = 1_000_000 * 1e18;
        melo.transfer(address(pts), reserve);
        console2.log("[5/5] Seeded 1M MELO into SameloPoints reserve");

        vm.stopBroadcast();

        console2.log("");
        console2.log("=== Deployment Summary (UUPS) ===");
        console2.log("NEXT_PUBLIC_MELO_ADDRESS=", address(melo));
        console2.log("NEXT_PUBLIC_POINTS_ADDRESS=", address(pts));
        console2.log("Points Impl:", address(ptsImpl));
        console2.log("================================");
    }
}
