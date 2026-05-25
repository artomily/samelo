// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "../src/SameloTreasury.sol";
import "../src/SameloSwap.sol";

/**
 * @title DeployFullUpgradeable
 * @notice Deploy SameloTreasury + SameloSwap as UUPS proxies, then wire them together.
 *
 * Usage (testnet):
 *   TESTNET=true \
 *   PRIVATE_KEY=0x... \
 *   ORACLE_ADDRESS=0x... \
 *   forge script script/DeployFullUpgradeable.s.sol:DeployFullUpgradeable \
 *     --rpc-url https://alfajores-forno.celo-testnet.org \
 *     --broadcast -vvv
 *
 * Usage (mainnet):
 *   PRIVATE_KEY=0x... \
 *   ORACLE_ADDRESS=0x... \
 *   forge script script/DeployFullUpgradeable.s.sol:DeployFullUpgradeable \
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
 *   TESTNET               — true = networks with CELO 0x471E..., default false
 */
contract DeployFullUpgradeable is Script {
    address constant CELO_TOKEN_MAINNET = 0x471EcE3750Da237f93B8E339c536989b8978a438;
    address constant CELO_TOKEN_TESTNET = 0x471EcE3750Da237f93B8E339c536989b8978a438;

    function run() public {
        bool isTestnet = vm.envOr("TESTNET", false);
        address celoToken = isTestnet ? CELO_TOKEN_TESTNET : CELO_TOKEN_MAINNET;

        uint256 deployerPk = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPk);
        address oracle = vm.envOr("ORACLE_ADDRESS", deployer);
        address distributor = vm.envOr("DISTRIBUTOR_ADDRESS", oracle);

        uint256 reserveRatioBps = vm.envOr("RESERVE_RATIO_BPS", uint256(1000));
        uint256 pointsToCELORate = vm.envOr("POINTS_TO_CELO_RATE", uint256(1e13));
        uint256 minSwapPoints = vm.envOr("MIN_SWAP_POINTS", uint256(500));
        uint256 maxSwapPoints = vm.envOr("MAX_SWAP_POINTS", uint256(50000));
        uint256 defaultCooldown = isTestnet ? 0 : 86400;
        uint256 swapCooldown = vm.envOr("SWAP_COOLDOWN_SECONDS", defaultCooldown);

        require(reserveRatioBps <= 3000, "DeployFullUpgradeable: reserveRatio > 30%");
        require(deployer != address(0), "DeployFullUpgradeable: PRIVATE_KEY required");

        vm.startBroadcast(deployerPk);

        console.log("-----------------------------------------------------------");
        console.log("Deploying SameloTreasury + SameloSwap (UUPS Proxies)");
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

        // 1. Deploy Treasury implementation
        SameloTreasury treasuryImpl = new SameloTreasury();
        console.log("[1/6] Treasury impl deployed:", address(treasuryImpl));

        // 2. Deploy Treasury proxy + initialize
        bytes memory treasuryInit = abi.encodeCall(
            SameloTreasury.initialize,
            (celoToken, oracle, distributor, reserveRatioBps)
        );
        ERC1967Proxy treasuryProxy = new ERC1967Proxy(address(treasuryImpl), treasuryInit);
        SameloTreasury treasury = SameloTreasury(payable(address(treasuryProxy)));
        console.log("[2/6] Treasury proxy deployed:", address(treasury));

        // 3. Deploy Swap implementation
        SameloSwap swapImpl = new SameloSwap();
        console.log("[3/6] Swap impl deployed:     ", address(swapImpl));

        // 4. Deploy Swap proxy + initialize
        bytes memory swapInit = abi.encodeCall(
            SameloSwap.initialize,
            (celoToken, address(treasury), oracle, pointsToCELORate, minSwapPoints, maxSwapPoints, swapCooldown)
        );
        ERC1967Proxy swapProxy = new ERC1967Proxy(address(swapImpl), swapInit);
        SameloSwap swap = SameloSwap(payable(address(swapProxy)));
        console.log("[4/6] Swap proxy deployed:    ", address(swap));

        // 5. Wire Swap into Treasury (grants SWAP_ROLE)
        treasury.setSwapContract(address(swap));
        console.log("[5/6] Swap wired to Treasury (SWAP_ROLE granted)");

        // 6. Transfer DEFAULT_ADMIN to deployer for both (already done in initialize)
        console.log("[6/6] Admin: ", deployer);

        vm.stopBroadcast();

        console.log("");
        console.log("-----------------------------------------------------------");
        console.log("DEPLOYMENT COMPLETE (UUPS)");
        console.log("-----------------------------------------------------------");
        console.log("Treasury Impl:", address(treasuryImpl));
        console.log("Treasury Proxy:", address(treasury));
        console.log("Swap Impl:    ", address(swapImpl));
        console.log("Swap Proxy:   ", address(swap));
        console.log("");
        console.log("Next steps:");
        console.log("1. Set NEXT_PUBLIC_TREASURY_ADDRESS =", address(treasury));
        console.log("2. Set NEXT_PUBLIC_SWAP_ADDRESS     =", address(swap));
        console.log("3. Fund treasury: approve CELO, then call depositRevenue()");
        console.log("");
        console.log("To upgrade later:");
        console.log("  1. Deploy new implementation .sol");
        console.log("  2. Call proxy.upgradeTo(newImpl)  from admin account");
    }
}
