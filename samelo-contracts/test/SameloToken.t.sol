// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/SameloToken.sol";

contract SameloTokenTest is Test {
    SameloToken public melo;
    address public deployer = makeAddr("deployer");
    address public alice = makeAddr("alice");

    function setUp() public {
        vm.prank(deployer);
        melo = new SameloToken(deployer);
    }

    function test_name() public {
        assertEq(melo.name(), "Samelo Token");
    }

    function test_symbol() public {
        assertEq(melo.symbol(), "MELO");
    }

    function test_decimals() public {
        assertEq(melo.decimals(), 18);
    }

    function test_maxSupply() public {
        assertEq(melo.MAX_SUPPLY(), 100_000_000 * 1e18);
    }

    function test_totalSupplyEqualsMaxSupply() public {
        assertEq(melo.totalSupply(), melo.MAX_SUPPLY());
    }

    function test_deployerReceivesFullSupply() public {
        assertEq(melo.balanceOf(deployer), melo.MAX_SUPPLY());
    }

    function test_transfer() public {
        uint256 amount = 1000 * 1e18;
        vm.prank(deployer);
        melo.transfer(alice, amount);
        assertEq(melo.balanceOf(alice), amount);
        assertEq(melo.balanceOf(deployer), melo.MAX_SUPPLY() - amount);
    }

    function test_transferFrom() public {
        uint256 amount = 500 * 1e18;
        vm.prank(deployer);
        melo.approve(alice, amount);

        vm.prank(alice);
        melo.transferFrom(deployer, alice, amount);
        assertEq(melo.balanceOf(alice), amount);
    }

    function test_cannotTransferMoreThanBalance() public {
        vm.prank(alice);
        vm.expectRevert();
        melo.transfer(deployer, 1);
    }

    function test_owner() public {
        assertEq(melo.owner(), deployer);
    }
}
