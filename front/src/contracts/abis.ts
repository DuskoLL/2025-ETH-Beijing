// 智能合约 ABI 定义

// CoreLending 合约 ABI
export const CORE_LENDING_ABI = [
  // 事件
  "event Borrowed(address indexed user, uint256 loanId, uint256 amount, uint256 dueTime)",
  "event Repaid(address indexed user, uint256 loanId, uint256 amount)",
  
  // 函数
  "function borrow(uint256 amount, uint256 collateralAmount, uint256 duration) external",
  "function repay(uint256 loanId) external",
  "function liquidate(address user, uint256 loanId) external",
  "function lendingPool() external view returns (address)",
  "function blacklist() external view returns (address)",
  "function auctionManager() external view returns (address)"
];

// LendingPool 合约 ABI
export const LENDING_POOL_ABI = [
  // 结构体
  "struct Loan { uint256 amount; uint256 collateral; uint256 dueTime; bool liquidated; address borrower; }",
  
  // 事件
  "event LoanLiquidated(address indexed borrower, uint256 loanId, address liquidator, bool isSelfLiquidation, uint256 amountRepaid, uint256 penaltyOrReward)",
  
  // 常量
  "function INTEREST_RATE() external view returns (uint256)",
  "function SELF_LIQUIDATION_PENALTY() external view returns (uint256)",
  "function THIRD_PARTY_LIQUIDATION_REWARD() external view returns (uint256)",
  
  // 函数
  "function tokenA() external view returns (address)",
  "function tokenB() external view returns (address)",
  "function borrow(address user, uint256 amount, uint256 collateralAmount, uint256 duration) external returns (uint256)",
  "function repay(address user, uint256 loanId) external returns (uint256)",
  "function liquidate(address user, uint256 loanId, address liquidator) external returns (bool needsAuction, uint256 shortage)",
  "function getLoan(address user, uint256 loanId) external view returns (tuple(uint256 amount, uint256 collateral, uint256 dueTime, bool liquidated, address borrower))",
  "function getLoans(address user) external view returns (tuple(uint256 amount, uint256 collateral, uint256 dueTime, bool liquidated, address borrower)[])",
  "function loans(address, uint256) external view returns (uint256 amount, uint256 collateral, uint256 dueTime, bool liquidated, address borrower)"
];

// AuctionManager 合约 ABI
export const AUCTION_MANAGER_ABI = [
  // 枚举
  "enum AuctionType { Collateral, Debt }",
  
  // 结构体
  "struct Auction { uint8 auctionType; address user; uint256 loanId; uint256 startTime; uint256 endTime; uint256 amount; uint256 minBid; address highestBidder; uint256 highestBid; bool settled; }",
  
  // 事件
  "event AuctionStarted(uint256 auctionId, uint8 auctionType, address user, uint256 loanId, uint256 amount)",
  "event BidPlaced(uint256 auctionId, address bidder, uint256 amount)",
  "event AuctionSettled(uint256 auctionId, address winner, uint256 amount)",
  
  // 函数
  "function tokenA() external view returns (address)",
  "function tokenB() external view returns (address)",
  "function auctionDuration() external view returns (uint256)",
  "function debtAuctionDuration() external view returns (uint256)",
  "function auctions(uint256) external view returns (uint8 auctionType, address user, uint256 loanId, uint256 startTime, uint256 endTime, uint256 amount, uint256 minBid, address highestBidder, uint256 highestBid, bool settled)",
  "function startAuction(address user, uint256 loanId, uint256 shortage) external",
  "function bid(uint256 auctionId, uint256 bidAmount) external",
  "function settleAuction(uint256 auctionId) external"
];

// BlackList 合约 ABI
export const BLACK_LIST_ABI = [
  "function isBlacklisted(address account) external view returns (bool)",
  "function addToBlacklist(address account) external",
  "function removeFromBlacklist(address account) external"
];

// ERC20 代币 ABI
export const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint amount) returns (bool)",
  "function transferFrom(address sender, address recipient, uint amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint amount)",
  "event Approval(address indexed owner, address indexed spender, uint amount)"
];
