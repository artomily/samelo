// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/SameloPoints.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract SameloPointsTest is Test {
    SameloPoints public points;
    address public owner = makeAddr("owner");
    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");

    function setUp() public {
        SameloPoints impl = new SameloPoints();
        bytes memory initData = abi.encodeWithSelector(SameloPoints.initialize.selector, owner);
        ERC1967Proxy proxy = new ERC1967Proxy(address(impl), initData);
        points = SameloPoints(address(proxy));
    }

    function test_initialOwner() public {
        assertEq(points.owner(), owner);
    }

    function test_earn_creditsPoints() public {
        vm.prank(alice);
        points.earn();
        assertEq(points.points(alice), 10);
    }

    function test_earn_emitsEvent() public {
        vm.prank(alice);
        vm.expectEmit(true, false, false, true);
        emit SameloPoints.PointsEarned(alice, 10, 10, block.timestamp);
        points.earn();
    }

    function test_earn_incrementsTotalPointsIssued() public {
        vm.prank(alice);
        points.earn();
        vm.prank(bob);
        points.earn();
        assertEq(points.totalPointsIssued(), 20);
    }

    function test_earn_cooldownPreventsSpam() public {
        vm.prank(alice);
        points.earn();

        vm.prank(alice);
        vm.expectRevert();
        points.earn();
    }

    function test_earn_worksAfterCooldown() public {
        vm.prank(alice);
        points.earn();

        vm.warp(block.timestamp + 11);
        vm.prank(alice);
        points.earn();
        assertEq(points.points(alice), 20);
    }

    function test_creditPoints_onlyOwner() public {
        vm.prank(alice);
        vm.expectRevert();
        points.creditPoints(alice, 100);
    }

    function test_creditPoints_creditsCorrectly() public {
        vm.prank(owner);
        points.creditPoints(alice, 500);
        assertEq(points.points(alice), 500);
    }

    function test_creditPoints_zeroUserReverts() public {
        vm.prank(owner);
        vm.expectRevert("Points: zero user");
        points.creditPoints(address(0), 100);
    }

    function test_creditPoints_zeroAmountReverts() public {
        vm.prank(owner);
        vm.expectRevert("Points: zero amount");
        points.creditPoints(alice, 0);
    }

    function test_redeem_revertsMeloNotConfigured() public {
        vm.prank(owner);
        points.creditPoints(alice, 1000);

        vm.prank(alice);
        vm.expectRevert(SameloPoints.MeloNotConfigured.selector);
        points.redeem(1000);
    }

    function test_setMeloToken_onlyOwner() public {
        vm.prank(alice);
        vm.expectRevert();
        points.setMeloToken(address(1));
    }

    function test_setEarnCooldown_onlyOwner() public {
        vm.prank(alice);
        vm.expectRevert();
        points.setEarnCooldown(60);
    }
}
