// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/SameloSwap.sol";
import "../src/SameloToken.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract MockTreasury {
    function requestFunds(address token, address to, uint256 amount) external {}
}

contract SameloSwapTest is Test {
    SameloSwap public swap;
    SameloToken public melo;
    MockTreasury public treasury;

    address public admin = makeAddr("admin");
    address public oracle = makeAddr("oracle");
    address public alice = makeAddr("alice");

    uint256 public constant RATE = 1e12;
    uint256 public constant MIN_POINTS = 100;
    uint256 public constant MAX_POINTS = 10_000;
    uint256 public constant COOLDOWN = 60;

    function setUp() public {
        melo = new SameloToken(admin);
        treasury = new MockTreasury();

        SameloSwap impl = new SameloSwap();
        bytes memory initData = abi.encodeWithSelector(
            SameloSwap.initialize.selector,
            address(melo),
            address(treasury),
            oracle,
            RATE,
            MIN_POINTS,
            MAX_POINTS,
            COOLDOWN
        );
        vm.prank(admin);
        ERC1967Proxy proxy = new ERC1967Proxy(address(impl), initData);
        swap = SameloSwap(address(proxy));
    }

    function test_initialState() public {
        assertEq(address(swap.celoToken()), address(melo));
        assertEq(swap.oracle(), oracle);
        assertEq(swap.pointsToCELORate(), RATE);
        assertEq(swap.minSwapPoints(), MIN_POINTS);
        assertEq(swap.maxSwapPoints(), MAX_POINTS);
        assertEq(swap.swapCooldown(), COOLDOWN);
    }

    function test_notPausedInitially() public {
        assertFalse(swap.paused());
    }

    function test_adminHasDefaultAdminRole() public {
        assertTrue(swap.hasRole(swap.DEFAULT_ADMIN_ROLE(), admin));
    }

    function test_initializeReverts_zeroOracle() public {
        SameloSwap impl2 = new SameloSwap();
        bytes memory badInit = abi.encodeWithSelector(
            SameloSwap.initialize.selector,
            address(melo),
            address(treasury),
            address(0),
            RATE, MIN_POINTS, MAX_POINTS, COOLDOWN
        );
        vm.expectRevert("Swap: zero oracle");
        new ERC1967Proxy(address(impl2), badInit);
    }

    function test_initializeReverts_zeroRate() public {
        SameloSwap impl2 = new SameloSwap();
        bytes memory badInit = abi.encodeWithSelector(
            SameloSwap.initialize.selector,
            address(melo),
            address(treasury),
            oracle,
            0, MIN_POINTS, MAX_POINTS, COOLDOWN
        );
        vm.expectRevert("Swap: zero rate");
        new ERC1967Proxy(address(impl2), badInit);
    }

    function test_initializeReverts_maxLessThanMin() public {
        SameloSwap impl2 = new SameloSwap();
        bytes memory badInit = abi.encodeWithSelector(
            SameloSwap.initialize.selector,
            address(melo),
            address(treasury),
            oracle,
            RATE, MAX_POINTS, MIN_POINTS, COOLDOWN
        );
        vm.expectRevert("Swap: max <= min");
        new ERC1967Proxy(address(impl2), badInit);
    }
}
