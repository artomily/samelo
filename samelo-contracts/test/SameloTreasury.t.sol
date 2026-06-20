// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/SameloTreasury.sol";
import "../src/SameloToken.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract SameloTreasuryTest is Test {
    SameloTreasury public treasury;
    SameloToken public melo;

    address public admin = makeAddr("admin");
    address public oracle = makeAddr("oracle");
    address public distributor = makeAddr("distributor");

    uint256 public constant RESERVE_RATIO = 1000; // 10%

    function setUp() public {
        melo = new SameloToken(admin);

        SameloTreasury impl = new SameloTreasury();
        bytes memory initData = abi.encodeWithSelector(
            SameloTreasury.initialize.selector,
            address(melo),
            oracle,
            distributor,
            RESERVE_RATIO
        );
        vm.prank(admin);
        ERC1967Proxy proxy = new ERC1967Proxy(address(impl), initData);
        treasury = SameloTreasury(address(proxy));
    }

    function test_initialState() public {
        assertEq(address(treasury.celoToken()), address(melo));
        assertEq(treasury.oracle(), oracle);
        assertEq(treasury.rewardDistributor(), distributor);
        assertEq(treasury.reserveRatio(), RESERVE_RATIO);
        assertEq(treasury.totalDeposited(), 0);
        assertEq(treasury.totalPaidOut(), 0);
    }

    function test_adminHasDefaultAdminRole() public {
        assertTrue(treasury.hasRole(treasury.DEFAULT_ADMIN_ROLE(), admin));
    }

    function test_maxReserveRatio() public {
        assertEq(treasury.MAX_RESERVE_RATIO(), 3000);
    }

    function test_oracleRole() public {
        assertEq(treasury.ORACLE_ROLE(), keccak256("ORACLE_ROLE"));
    }

    function test_distributorRole() public {
        assertEq(treasury.DISTRIBUTOR_ROLE(), keccak256("DISTRIBUTOR_ROLE"));
    }

    function test_swapRole() public {
        assertEq(treasury.SWAP_ROLE(), keccak256("SWAP_ROLE"));
    }

    function test_initializeReverts_ratioTooHigh() public {
        SameloTreasury impl2 = new SameloTreasury();
        bytes memory badInit = abi.encodeWithSelector(
            SameloTreasury.initialize.selector,
            address(melo),
            oracle,
            distributor,
            3001 // > MAX_RESERVE_RATIO
        );
        vm.expectRevert("Treasury: ratio too high");
        new ERC1967Proxy(address(impl2), badInit);
    }

    function test_initializeReverts_zeroOracle() public {
        SameloTreasury impl2 = new SameloTreasury();
        bytes memory badInit = abi.encodeWithSelector(
            SameloTreasury.initialize.selector,
            address(melo),
            address(0),
            distributor,
            RESERVE_RATIO
        );
        vm.expectRevert("Treasury: zero oracle");
        new ERC1967Proxy(address(impl2), badInit);
    }

    function test_notPausedInitially() public {
        assertFalse(treasury.paused());
    }
}
