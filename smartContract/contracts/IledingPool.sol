// ILendingPool.sol
interface ILendingPool {

    struct Loan {
        uint256 amount;
        uint256 collateral;
        uint256 dueTime;
        bool liquidated;
        address borrower;
    }

    function borrow(address user, uint256 amount, uint256 collateralAmount, uint256 duration) external returns(uint);
    function repay(address user, uint256 loanId) external returns(uint);
    function liquidate(address user, uint256 loanId, address liquidater) external returns (bool needsAuction, uint256 shortage, uint );
    function getLoan(address user, uint256 loanId) external view returns (Loan memory);
}

// IBlacklist.sol
interface IBlacklist {
    function isBlacklisted(address account) external view returns (bool);
    function addToBlacklist(address account) external;
    function removeFromBlacklist(address account) external;
}

// IAuctionManager.sol
interface IAuctionManager {
    function startAuction(address user, uint256 loanId) external;
    function bid(uint256 auctionId, uint256 bidAmount) external;
    function settleAuction(uint256 auctionId) external;
}