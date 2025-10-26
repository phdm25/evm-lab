// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract LogicV1 {
    uint256[50] private __gap;

    uint256 public value;
    bool private initialized;

    function initialize(uint256 _v) external {
        require(!initialized, "Already initialized");
        value = _v;
        initialized = true;
    }

    function setValue(uint256 _v) external {
        value = _v;
    }

    function getValue() external view returns (uint256) {
        return value;
    }
}
