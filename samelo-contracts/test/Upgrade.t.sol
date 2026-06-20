// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/SameloPoints.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

/// @dev Minimal v2 to test upgrade path without changing storage layout
contract SameloPointsV2 is SameloPoints {
    function version() external pure returns (string memory) {
        return "v2";
    }
}

contract UpgradeTest is Test {
    SameloPoints public points;
    address public owner = makeAddr("owner");
    address public alice = makeAddr("alice");

    function setUp() public {
        SameloPoints impl = new SameloPoints();
        bytes memory initData = abi.encodeWithSelector(SameloPoints.initialize.selector, owner);
        ERC1967Proxy proxy = new ERC1967Proxy(address(impl), initData);
        points = SameloPoints(address(proxy));
    }

    function test_upgradePreservesState() public {
        vm.prank(owner);
        points.creditPoints(alice, 1000);
        assertEq(points.points(alice), 1000);

        SameloPointsV2 newImpl = new SameloPointsV2();
        vm.prank(owner);
        points.upgradeToAndCall(address(newImpl), "");

        assertEq(points.points(alice), 1000);
    }

    function test_upgradeOnlyOwner() public {
        SameloPointsV2 newImpl = new SameloPointsV2();
        vm.prank(alice);
        vm.expectRevert();
        points.upgradeToAndCall(address(newImpl), "");
    }

    function test_upgradedContractHasNewFunction() public {
        SameloPointsV2 newImpl = new SameloPointsV2();
        vm.prank(owner);
        points.upgradeToAndCall(address(newImpl), "");

        SameloPointsV2 v2 = SameloPointsV2(address(points));
        assertEq(v2.version(), "v2");
    }
}
