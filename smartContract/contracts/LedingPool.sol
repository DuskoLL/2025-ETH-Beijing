// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IEERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LendingPool is Ownable{
    IERC20 public tokenA;
    IERC20 public tokenB;
    
     struct Loan {
        uint256 amount;
        uint256 collateral;
        uint256 dueTime;
        bool liquidated;
        address borrower;
    }
    
    mapping(address => Loan[]) public loans;
    uint256 public constant INTEREST_RATE = 10; // 10% 利息
    uint256 public constant SELF_LIQUIDATION_PENALTY = 5; // 5% 自行清算罚金
    uint256 public constant THIRD_PARTY_LIQUIDATION_REWARD = 2; // 2% 第三方清算奖励

    event LoanLiquidated(
        address indexed borrower,
        uint256 loanId,
        address liquidator,
        bool isSelfLiquidation,
        uint256 amountRepaid,
        uint256 penaltyOrReward
    );
    
    constructor(address _tokenA, address _tokenB) Ownable(msg.sender) {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }
    
    function borrow(address user, uint256 amount, uint256 collateralAmount, uint256 duration) external returns(uint index) {
        require(collateralAmount >= (amount * 150) / 100, "Insufficient collateral");
        require(tokenB.transferFrom(user, address(this), collateralAmount), "Collateral transfer failed");
        require(tokenA.transfer(user, amount), "Loan transfer failed");
        
        loans[user].push(Loan({
            amount: amount,
            collateral: collateralAmount,
            dueTime: block.timestamp + duration,
            liquidated: false,
            borrower: user
        }));
        return loans[user].length - 1;
    }
    
    function repay(address user, uint256 loanId) external returns(uint amount) {
        Loan storage loan = loans[user][loanId];
        require(!loan.liquidated, "Loan already liquidated");
        
        uint256 repayment = loan.amount * (100 + INTEREST_RATE) / 100;
        require(tokenA.transferFrom(user, address(this), repayment), "Repayment failed");
        require(tokenB.transfer(user, loan.collateral), "Collateral return failed");
        
        loan.liquidated = true;

        return repayment;
    }
    
    function liquidate(address user, uint256 loanId, address liquidator) external returns (bool needsAuction, uint256 shortage) {
        Loan storage loan = loans[user][loanId];
        require(!loan.liquidated, "the loan is done");
        require(block.timestamp > loan.dueTime, "the loan is not over");

        bool isSelfLiquidation = (liquidator == loan.borrower);
        
        if (isSelfLiquidation) {
            // 借款人自行清算 - 支付本金+利息+罚金
            uint256 penalty = loan.amount * SELF_LIQUIDATION_PENALTY / 100;
            uint256 totalDue = loan.amount * (100 + INTEREST_RATE) / 100 + penalty;
            
            require(tokenA.transferFrom(liquidator, address(this), totalDue), "penalty payment failed");
            require(tokenB.transfer(liquidator, loan.collateral), "collateral return failed");
            
            loan.liquidated = true;
            emit LoanLiquidated(user, loanId, liquidator, true, loan.amount, penalty);
            return (false, 0);
        } else {
            // 第三方清算 - 启动拍卖流程
            uint256 reward = loan.amount * THIRD_PARTY_LIQUIDATION_REWARD / 100;
            
            // 给清算人奖励（从抵押品中扣除）
            uint256 remainingCollateral = loan.collateral - reward;
            require(tokenB.transfer(liquidator, reward), "reward payment failed");
            
            // 剩余抵押品将用于拍卖
            loan.collateral = remainingCollateral;
            
            emit LoanLiquidated(user, loanId, liquidator, false, 0, reward);
            return (true, loan.amount); // 需要拍卖全部贷款金额
        }
    }
    
    function getLoan(address user, uint256 loanId) external view returns (Loan memory) {
        return loans[user][loanId];
    }

    function getLoans(address user) external view returns (Loan[] memory) {
        return loans[user];
    }
}