// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleMultisig {
    struct Tx {
        address to;
        uint256 value;
        bytes data;
        bool executed;
        uint256 confirms;
    }

    address[] public owners;
    mapping(address => bool) public isOwner;
    uint256 public required;

    Tx[] public txs;
    mapping(uint256 => mapping(address => bool)) public confirmed;

    constructor(address[] memory _owners, uint256 _required) {
        require(_owners.length >= _required, "owners < required");
        for (uint256 i; i < _owners.length; i++) {
            owners.push(_owners[i]);
            isOwner[_owners[i]] = true;
        }
        required = _required;
    }

    function submit(address to, uint256 value, bytes memory data) external {
        require(isOwner[msg.sender], "not owner");
        txs.push(Tx(to, value, data, false, 0));
    }

    function confirm(uint256 id) external {
        require(isOwner[msg.sender], "not owner");
        require(!confirmed[id][msg.sender], "already confirmed");
        confirmed[id][msg.sender] = true;
        txs[id].confirms++;
    }

    function execute(uint256 id) external {
        Tx storage t = txs[id];
        require(!t.executed, "done");
        require(t.confirms >= required, "not enough");
        t.executed = true;
        (bool ok, ) = t.to.call{value: t.value}(t.data);
        require(ok, "tx failed");
    }

    function getTransactionsCount() external view returns (uint256) {
        return txs.length;
    }

    function getTransaction(uint256 id)
        external
        view
        returns (address, bool, uint256, uint256)
    {
        Tx storage t = txs[id];
        return (t.to, t.executed, t.confirms, t.value);
    }

    function getOwners() external view returns (address[] memory) {
        return owners;
    }
}
