// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/SameloTreasurySimple.sol";

/**
 * @title DeploySimple
 * @notice Deploy SameloTreasurySimple to Celo Alfajores (testnet).
 *         No oracle, no swap - just on-chain claim.
 *
 * Usage:
 *   forge script script/DeploySimple.s.sol:DeploySimple \
 *     --rpc-url https://alfajores-forno.celo-testnet.org \
 *     --broadcast \
 *     -vvv
 *
 * Environment:
 *   RESERVE_RATIO_BPS - e.g., 1000 (10%)
 */
contract DeploySimple is Script {
    // Celo Sepolia (L2): CELO ERC-20 is at the same address as mainnet
    address constant CELO_TOKEN_MAINNET  = 0x471EcE3750Da237f93B8E339c536989b8978a438;
    address constant CELO_TOKEN_TESTNET  = 0x471EcE3750Da237f93B8E339c536989b8978a438;

    SameloTreasurySimple public treasury;

    function run() public {
        uint256 reserveRatioBps = vm.envOr("RESERVE_RATIO_BPS", uint256(1000));
        require(reserveRatioBps > 0 && reserveRatioBps <= 3000, "Invalid ratio");

        // Use TESTNET=true env to pick testnet CELO address
        bool isTestnet = vm.envOr("TESTNET", false);
        address celoToken = isTestnet ? CELO_TOKEN_TESTNET : CELO_TOKEN_MAINNET;

        uint256 deployerPk = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPk);

        console.log("-----------------------------------------------------------");
        console.log("Deploying SameloTreasurySimple");
        console.log("-----------------------------------------------------------");
        console.log("CELO Token:", celoToken);
        console.log("Reserve Ratio (bps):", reserveRatioBps);
        console.log("Testnet mode:", isTestnet);

        treasury = new SameloTreasurySimple(celoToken, reserveRatioBps);

        console.log("[SUCCESS] Treasury deployed:", address(treasury));

        vm.stopBroadcast();

        console.log("");
        console.log("-----------------------------------------------------------");
        console.log("DEPLOYMENT COMPLETE");
        console.log("-----------------------------------------------------------");
        console.log("Treasury:", address(treasury));
        console.log("");
        console.log("Next steps:");
        console.log("1. Approve CELO for treasury");
        console.log("2. Call depositRevenue() to add funds");
        console.log("3. Call releaseReward(user, amount) to pay users");
    }
}
