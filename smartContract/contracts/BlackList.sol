// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract Blacklist is Ownable {

    constructor() Ownable(msg.sender) {}

    using EnumerableSet for EnumerableSet.AddressSet;

    mapping(address => bool) public _blacklist;
    
    event AddedToBlacklist(address indexed account);
    event RemovedFromBlacklist(address indexed account);
    
    function isBlacklisted(address account) external view returns (bool) {
        return _blacklist[account];
    }
    
    function addToBlacklist(address account) external {
        require(!_blacklist[account], "Already blacklisted");
        _blacklist[account] = true;
        emit AddedToBlacklist(account);
    }
    
    function removeFromBlacklist(address account) external {
        _blacklist[account] = false;
        emit RemovedFromBlacklist(account);
    }
    
    // function getBlacklistedCount() external view returns (uint256) {
    //     return _blacklist.length();
    // }
}