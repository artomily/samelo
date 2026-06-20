// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/SameloToken.sol";

contract SameloTokenFuzzTest is Test {
    SameloToken public melo;
    address public deployer = makeAddr("deployer");

    function setUp() public {
        vm.prank(deployer);
        melo = new SameloToken(deployer);
    }

    function testFuzz_transfer_withinBalance(address to, uint256 amount) public {
        vm.assume(to != address(0));
        vm.assume(to != deployer);
        vm.assume(amount > 0 && amount <= melo.MAX_SUPPLY());

        vm.prank(deployer);
        melo.transfer(to, amount);
        assertEq(melo.balanceOf(to), amount);
        assertEq(melo.balanceOf(deployer), melo.MAX_SUPPLY() - amount);
    }

    function testFuzz_approve_and_transferFrom(address spender, address to, uint256 amount) public {
        vm.assume(spender != address(0) && to != address(0));
        vm.assume(spender != deployer && to != deployer && spender != to);
        vm.assume(amount > 0 && amount <= melo.MAX_SUPPLY());

        vm.prank(deployer);
        melo.approve(spender, amount);
        assertEq(melo.allowance(deployer, spender), amount);

        vm.prank(spender);
        melo.transferFrom(deployer, to, amount);
        assertEq(melo.balanceOf(to), amount);
    }

    function testFuzz_totalSupplyInvariant(address to, uint256 amount) public {
        vm.assume(to != address(0) && to != deployer);
        vm.assume(amount > 0 && amount <= melo.MAX_SUPPLY());

        uint256 supplyBefore = melo.totalSupply();
        vm.prank(deployer);
        melo.transfer(to, amount);
        assertEq(melo.totalSupply(), supplyBefore);
    }
}
