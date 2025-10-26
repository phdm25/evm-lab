// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Proxy {
    address public implementation;
    address public owner;

    constructor(address _impl) {
        implementation = _impl;
        owner = msg.sender;
    }

    function upgrade(address _newImpl, bytes calldata _initData) external {
        require(msg.sender == owner, "not owner");
        implementation = _newImpl;

        // if (_initData.length > 0) {
        //     (bool ok, ) = _newImpl.delegatecall(_initData);
        //     require(ok, "Upgrade init failed");
        // }
    }

    fallback() external payable {
        address impl = implementation;
        require(impl != address(0), "implementation not set");

        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), impl, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch result
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }

    receive() external payable {}
}
