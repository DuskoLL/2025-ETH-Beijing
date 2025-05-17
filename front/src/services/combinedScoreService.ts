import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { WashTradeStatus } from './washTradeService';

// ETH信用评分系统的响应类型
export interface EthCreditScore {
  is_professional: boolean;
  probability: number;
  feature_importance: {
    balance_ether: number;
    balance_value: number;
    total_transactions: number;
    sent: number;
    received: number;
    n_contracts_sent: number;
    n_contracts_received: number;
  };
  credit_score: number; // 基础信用评分
}

// 综合评分结果类型
export interface CombinedScoreResult {
  address: string;
  ethScore: EthCreditScore | null;
  washTradeStatus: WashTradeStatus | null;
  combinedScore: number; // 综合评分
  scoreComponents: {
    baseScore: number; // ETH系统的基础分
    washTradePenalty: number; // 对敲交易扣分
    finalScore: number; // 最终分数
  };
  riskLevel: 'low' | 'medium' | 'high' | 'very_high';
  recommendedInterestRate: number; // 推荐利率
  maxLoanAmount: number; // 最大贷款额度
  explanation: string; // 评分解释
}

// 创建RTK Query API
export const combinedScoreApi = createApi({
  reducerPath: 'combinedScoreApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }), // 使用相对路径，由代理转发
  endpoints: (builder) => ({
    // 获取综合评分
    getCombinedScore: builder.query<CombinedScoreResult, string>({
      queryFn: async (address, { dispatch, getState }, extraOptions, baseQuery) => {
        try {
          // 导入其他API
          const { washTradeApi } = await import('./washTradeService');
          
          // 1. 获取ETH信用评分
          const ethScoreResponse = await baseQuery({
            url: '/eth/credit-score',
            method: 'POST',
            body: { address }
          });
          
          if (ethScoreResponse.error) {
            throw new Error('获取ETH信用评分失败');
          }
          
          const ethScore = ethScoreResponse.data as EthCreditScore;
          
          // 2. 获取对敲交易检测结果
          // 使用RTK Query的API
          const washTradeResult = await dispatch(
            washTradeApi.endpoints.checkBlacklist.initiate(address)
          ).unwrap();
          
          // 3. 计算综合评分
          const baseScore = ethScore.credit_score; // ETH系统的基础分
          
          // 对敲交易扣分逻辑
          let washTradePenalty = 0;
          if (washTradeResult.detected) {
            // 根据惩罚程度计算严重程度
            const penaltyLevel = washTradeResult.penalty >= 30 ? 'high' : 
                                washTradeResult.penalty >= 15 ? 'medium' : 'low';
            washTradePenalty = penaltyLevel === 'high' ? 40 : 
                              penaltyLevel === 'medium' ? 25 : 15;
          }
          
          // 最终分数
          const finalScore = Math.max(0, Math.min(100, baseScore - washTradePenalty));
          
          // 计算风险等级
          let riskLevel: 'low' | 'medium' | 'high' | 'very_high';
          if (finalScore >= 80) {
            riskLevel = 'low';
          } else if (finalScore >= 60) {
            riskLevel = 'medium';
          } else if (finalScore >= 40) {
            riskLevel = 'high';
          } else {
            riskLevel = 'very_high';
          }
          
          // 计算推荐利率 (5% - 25%)
          const recommendedInterestRate = 5 + (25 - 5) * (1 - finalScore / 100);
          
          // 计算最大贷款额度 (0 - 10 ETH)
          const maxLoanAmount = finalScore >= 40 ? (finalScore / 100) * 10 : 0;
          
          // 生成评分解释
          let explanation = `基础信用评分: ${baseScore}分。`;
          if (washTradeResult.detected) {
            const penaltyLevel = washTradeResult.penalty >= 30 ? 'high' : 
                                washTradeResult.penalty >= 15 ? 'medium' : 'low';
            const levelText = penaltyLevel === 'high' ? '高' : 
                            penaltyLevel === 'medium' ? '中' : '低';
            explanation += ` 检测到${levelText}级别的对敲交易行为，扣除${washTradePenalty}分。`;
          } else {
            explanation += ' 未检测到对敲交易行为。';
          }
          explanation += ` 最终评分: ${finalScore}分。`;
          
          // 返回综合结果
          return {
            data: {
              address,
              ethScore,
              washTradeStatus: washTradeResult,
              combinedScore: finalScore,
              scoreComponents: {
                baseScore,
                washTradePenalty,
                finalScore
              },
              riskLevel,
              recommendedInterestRate,
              maxLoanAmount,
              explanation
            }
          };
        } catch (error) {
          return {
            error: { status: 'CUSTOM_ERROR', error: (error as Error).message }
          };
        }
      }
    })
  })
});

// 导出hooks
export const { useGetCombinedScoreQuery } = combinedScoreApi;
