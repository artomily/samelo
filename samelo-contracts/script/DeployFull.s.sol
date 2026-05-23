// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/SameloTreasury.sol";
import "../src/SameloSwap.sol";

/**
 * @title DeployFull
 * @notice Deploy SameloTreasury + SameloSwap, then wire them together.
 *
 * Usage (testnet):
 *   TESTNET=true \
 *   PRIVATE_KEY=0x... \
 *   ORACLE_ADDRESS=0x... \
 *   forge script script/DeployFull.s.sol:DeployFull \
 *     --rpc-url https://alfajores-forno.celo-testnet.org \
 *     --broadcast -vvv
 *
 * Usage (mainnet):
 *   PRIVATE_KEY=0x... \
 *   ORACLE_ADDRESS=0x... \
 *   forge script script/DeployFull.s.sol:DeployFull \
 *     --rpc-url https://forno.celo.org \
 *     --broadcast -vvv
 *
 * Environment variables:
 *   PRIVATE_KEY           — deployer private key (becomes DEFAULT_ADMIN)
 *   ORACLE_ADDRESS        — oracle signer wallet (ORACLE_ROLE + DISTRIBUTOR_ROLE)
 *   DISTRIBUTOR_ADDRESS   — optional separate distributor (defaults to oracle)
 *   RESERVE_RATIO_BPS     — reserve % in basis points, default 1000 (10%)
 *   POINTS_TO_CELO_RATE   — CELO wei per 1 point, default 1e13 (0.00001 CELO)
 *   MIN_SWAP_POINTS       — minimum points per swap, default 500
 *   MAX_SWAP_POINTS       — maximum points per swap, default 50000
 *   SWAP_COOLDOWN_SECONDS — cooldown between swaps, default 0 (testnet) / 86400 (mainnet)
 *   TESTNET               — true = use Sepolia CELO token, default false
 */
contract DeployFull is Script {
    // Celo Sepolia (L2): CELO ERC-20 is at the same address as mainnet
    address constant CELO_TOKEN_MAINNET = 0x471EcE3750Da237f93B8E339c536989b8978a438;
    address constant CELO_TOKEN_TESTNET = 0x471EcE3750Da237f93B8E339c536989b8978a438;

    SameloTreasury public treasury;
    SameloSwap public swap;

    function run() public {
        bool isTestnet = vm.envOr("TESTNET", false);
        address celoToken = isTestnet ? CELO_TOKEN_TESTNET : CELO_TOKEN_MAINNET;

        uint256 deployerPk = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPk);
        address oracle = vm.envAddress("ORACLE_ADDRESS");
        address distributor = vm.envOr("DISTRIBUTOR_ADDRESS", oracle);

        uint256 reserveRatioBps = vm.envOr("RESERVE_RATIO_BPS", uint256(1000));
        uint256 pointsToCELORate = vm.envOr("POINTS_TO_CELO_RATE", uint256(1e13));
        uint256 minSwapPoints = vm.envOr("MIN_SWAP_POINTS", uint256(500));
        uint256 maxSwapPoints = vm.envOr("MAX_SWAP_POINTS", uint256(50000));
        // Default: 0 for testnet, 86400 (1 day) for mainnet
        uint256 defaultCooldown = isTestnet ? 0 : 86400;
        uint256 swapCooldown = vm.envOr("SWAP_COOLDOWN_SECONDS", defaultCooldown);

        require(reserveRatioBps <= 3000, "DeployFull: reserveRatio > 30%");
        require(oracle != address(0), "DeployFull: oracle is zero");

        vm.startBroadcast(deployerPk);

        console.log("-----------------------------------------------------------");
        console.log("Deploying SameloTreasury + SameloSwap");
        console.log("-----------------------------------------------------------");
        console.log("Network:         ", isTestnet ? "TESTNET" : "MAINNET");
        console.log("CELO Token:      ", celoToken);
        console.log("Deployer:        ", deployer);
        console.log("Oracle:          ", oracle);
        console.log("Distributor:     ", distributor);
        console.log("Reserve Ratio:   ", reserveRatioBps, "bps");
        console.log("Points -> CELO Rate:", pointsToCELORate, "wei/pt");
        console.log("Min Swap Points: ", minSwapPoints);
        console.log("Max Swap Points: ", maxSwapPoints);
        console.log("Swap Cooldown:   ", swapCooldown, "seconds");

        // 1. Deploy Treasury
        treasury = new SameloTreasury(
            celoToken,
            oracle,
            distributor,
            reserveRatioBps
        );
        console.log("[1/3] Treasury deployed:", address(treasury));

        // 2. Deploy Swap (points-to-CELO)
        swap = new SameloSwap(
            celoToken,
            address(treasury),
            oracle,
            pointsToCELORate,
            minSwapPoints,
            maxSwapPoints,
            swapCooldown
        );
        console.log("[2/3] Swap deployed:    ", address(swap));

        // 3. Wire Swap into Treasury (grants SWAP_ROLE)
        treasury.setSwapContract(address(swap));
        console.log("[3/3] Swap wired to Treasury (SWAP_ROLE granted)");

        vm.stopBroadcast();

        console.log("");
        console.log("-----------------------------------------------------------");
        console.log("DEPLOYMENT COMPLETE");
        console.log("-----------------------------------------------------------");
        console.log("Treasury:", address(treasury));
        console.log("Swap:    ", address(swap));
        console.log("");
        console.log("Next steps:");
        console.log("1. Set NEXT_PUBLIC_TREASURY_ADDRESS =", address(treasury));
        console.log("2. Set NEXT_PUBLIC_SWAP_ADDRESS     =", address(swap));
        console.log("3. Fund treasury: approve CELO, then call depositRevenue()");
    }
}
