// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract LogicV2 {
    uint256[50] private __gap; 
    uint256 public value;

    function setValue(uint256 _v) external {
        value = _v * 2;
    }

    function getValue() external view returns (uint256) {
        return value;
    }

    function increment() external {
        value++;
    }
}
