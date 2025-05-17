// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IledingPool.sol";
import "./BlackList.sol";
import "./AuctionManager.sol";

contract CoreLending is Ownable {
    ILendingPool public lendingPool;
    IBlacklist public blacklist;
    IAuctionManager public auctionManager;
    
    event Borrowed(address indexed user, uint256 loanId, uint256 amount, uint256 dueTime);
    event Repaid(address indexed user, uint256 loanId, uint256 amount);
    
    constructor(address _lendingPool, address _blacklist, address _auctionManager) Ownable(msg.sender) {
        lendingPool = ILendingPool(_lendingPool);
        blacklist = IBlacklist(_blacklist);
        auctionManager = IAuctionManager(_auctionManager);
    }
    
    function borrow(uint256 amount, uint256 collateralAmount, uint256 duration) external {
        require(!blacklist.isBlacklisted(msg.sender), "Blacklisted user");
        uint index = lendingPool.borrow(msg.sender, amount, collateralAmount, duration);
        emit Borrowed(msg.sender, index, amount, block.timestamp + duration);
    }
    
    function repay(uint256 loanId) external {
        uint repayamount = lendingPool.repay(msg.sender, loanId);
        emit Repaid(msg.sender, loanId, repayamount);
    }
    
    function liquidate(address user, uint256 loanId) external {
        (bool needsAuction, uint256 shortage) = lendingPool.liquidate(user, loanId, msg.sender);
        if (needsAuction) {
            blacklist.addToBlacklist(user);
            auctionManager.startAuction(user, loanId, shortage);
        }
    }
    
    function setLendingPool(address _lendingPool) external onlyOwner {
        lendingPool = ILendingPool(_lendingPool);
    }
    
    function setBlacklist(address _blacklist) external onlyOwner {
        blacklist = IBlacklist(_blacklist);
    }
    
    function setAuctionManager(address _auctionManager) external onlyOwner {
        auctionManager = IAuctionManager(_auctionManager);
    }
}