// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/SameloPoints.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract SameloPointsFuzzTest is Test {
    SameloPoints public points;
    address public owner = makeAddr("owner");

    function setUp() public {
        SameloPoints impl = new SameloPoints();
        bytes memory initData = abi.encodeWithSelector(SameloPoints.initialize.selector, owner);
        ERC1967Proxy proxy = new ERC1967Proxy(address(impl), initData);
        points = SameloPoints(address(proxy));
    }

    function testFuzz_creditPoints_anyAmount(address user, uint256 amount) public {
        vm.assume(user != address(0));
        vm.assume(amount > 0 && amount < 1_000_000_000);
        vm.prank(owner);
        points.creditPoints(user, amount);
        assertEq(points.points(user), amount);
    }

    function testFuzz_creditPoints_accumulates(address user, uint256 a, uint256 b) public {
        vm.assume(user != address(0));
        vm.assume(a > 0 && a < 1e9);
        vm.assume(b > 0 && b < 1e9);
        vm.startPrank(owner);
        points.creditPoints(user, a);
        points.creditPoints(user, b);
        vm.stopPrank();
        assertEq(points.points(user), a + b);
    }

    function testFuzz_earn_onlyOncePerCooldown(address user) public {
        vm.assume(user != address(0));
        vm.prank(user);
        points.earn();
        assertEq(points.points(user), 10);

        vm.prank(user);
        vm.expectRevert();
        points.earn();
    }
}
