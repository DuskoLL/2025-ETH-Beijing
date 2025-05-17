import { ethers } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useLending } from './hooks';

// 信用评分因素权重
const SCORE_WEIGHTS = {
  tokenStaking: 0.25,    // 代币质押量
  loanRepayment: 0.30,   // 贷款还款记录
  activity: 0.20,        // 链上活跃度
  governanceTokens: 0.15, // 治理代币持有
  aiScore: 0.10          // AI模型评分
};

// 信用评分等级
export const CREDIT_LEVELS = {
  EXCELLENT: { min: 90, max: 100, name: '优秀', color: '#4caf50' },
  GOOD: { min: 80, max: 89, name: '良好', color: '#8bc34a' },
  FAIR: { min: 70, max: 79, name: '一般', color: '#ffeb3b' },
  POOR: { min: 60, max: 69, name: '较差', color: '#ff9800' },
  BAD: { min: 0, max: 59, name: '很差', color: '#f44336' }
};

// 获取信用等级
export const getCreditLevel = (score: number) => {
  if (score >= CREDIT_LEVELS.EXCELLENT.min) return CREDIT_LEVELS.EXCELLENT;
  if (score >= CREDIT_LEVELS.GOOD.min) return CREDIT_LEVELS.GOOD;
  if (score >= CREDIT_LEVELS.FAIR.min) return CREDIT_LEVELS.FAIR;
  if (score >= CREDIT_LEVELS.POOR.min) return CREDIT_LEVELS.POOR;
  return CREDIT_LEVELS.BAD;
};

// 根据信用评分计算最大借款额度
export const calculateMaxLoanAmount = (creditScore: number) => {
  if (creditScore < 70) {
    // 信用评分较低，额度较小
    return Math.round((creditScore - 60) * 300);
  } else if (creditScore < 80) {
    // 中等信用评分
    return Math.round(3000 + (creditScore - 70) * 400);
  } else if (creditScore < 90) {
    // 良好信用评分
    return Math.round(7000 + (creditScore - 80) * 500);
  } else {
    // 优秀信用评分
    return Math.round(12000 + (creditScore - 90) * 800);
  }
};

// 信用评分Hook
export const useCreditScore = (address?: string) => {
  const { address: connectedAddress, isConnected } = useAccount();
  const { loans } = useLending();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [creditScore, setCreditScore] = useState<{
    score: number;
    level: string;
    factors: {
      tokenStaking: number;
      loanRepayment: number;
      activity: number;
      governanceTokens: number;
      aiScore: number;
    };
    maxLoanAmount: number;
  } | null>(null);

  // 计算信用评分
  const calculateCreditScore = useCallback(async (walletAddress: string) => {
    setLoading(true);
    setError('');
    
    try {
      // 在实际应用中，这里应该调用智能合约或API获取链上数据
      // 这里使用模拟数据进行演示
      
      // 1. 获取钱包地址的最后一个字符，用于模拟不同地址有不同的信用评分
      const lastChar = walletAddress.slice(-1).toLowerCase();
      
      // 2. 根据地址生成基础分数
      let baseScore = 75; // 默认分数
      
      if (lastChar >= '0' && lastChar <= '9') {
        baseScore = 70 + parseInt(lastChar) * 3;
      } else if (lastChar >= 'a' && lastChar <= 'f') {
        baseScore = 85 + (lastChar.charCodeAt(0) - 'a'.charCodeAt(0)) * 2;
      }
      
      // 3. 根据贷款记录调整分数
      let loanRepaymentScore = 80;
      if (loans && loans.length > 0) {
        // 计算已还款贷款的比例
        const repaidLoans = loans.filter(loan => loan.liquidated).length;
        const repaymentRatio = repaidLoans / loans.length;
        
        loanRepaymentScore = Math.min(100, Math.round(repaymentRatio * 100) + 70);
      }
      
      // 4. 计算各因素得分
      const factors = {
        tokenStaking: Math.min(100, Math.round(Math.random() * 30) + baseScore - 10),
        loanRepayment: loanRepaymentScore,
        activity: Math.min(100, Math.round(Math.random() * 20) + baseScore),
        governanceTokens: Math.min(100, Math.round(Math.random() * 40) + baseScore - 20),
        aiScore: Math.min(100, Math.round(Math.random() * 15) + baseScore)
      };
      
      // 5. 计算加权总分
      const totalScore = Math.round(
        factors.tokenStaking * SCORE_WEIGHTS.tokenStaking +
        factors.loanRepayment * SCORE_WEIGHTS.loanRepayment +
        factors.activity * SCORE_WEIGHTS.activity +
        factors.governanceTokens * SCORE_WEIGHTS.governanceTokens +
        factors.aiScore * SCORE_WEIGHTS.aiScore
      );
      
      // 6. 确保分数在有效范围内
      const finalScore = Math.min(Math.max(totalScore, 60), 100);
      
      // 7. 获取信用等级
      const level = getCreditLevel(finalScore).name;
      
      // 8. 计算最大借款额度
      const maxLoanAmount = calculateMaxLoanAmount(finalScore);
      
      // 设置结果
      setCreditScore({
        score: finalScore,
        level,
        factors,
        maxLoanAmount
      });
      
      return {
        score: finalScore,
        level,
        factors,
        maxLoanAmount
      };
    } catch (err) {
      console.error('计算信用评分失败:', err);
      setError('计算信用评分失败，请稍后再试');
      return null;
    } finally {
      setLoading(false);
    }
  }, [loans]);

  // 查询信用评分
  const queryCreditScore = useCallback(async (walletAddress: string) => {
    return calculateCreditScore(walletAddress);
  }, [calculateCreditScore]);

  // 初始化 - 如果已连接钱包，自动计算信用评分
  useEffect(() => {
    if (isConnected && connectedAddress) {
      const targetAddress = address || connectedAddress;
      calculateCreditScore(targetAddress);
    }
  }, [isConnected, connectedAddress, address, calculateCreditScore]);

  return {
    creditScore,
    loading,
    error,
    queryCreditScore,
    calculateCreditScore
  };
};
