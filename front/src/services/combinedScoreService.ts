import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { WashTradeStatus, washTradeApi } from './washTradeService';
import { duskoApi } from './duskoService';

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
          
          // 2. 使用Dusko API获取对敏交易检测结果和信用评分
          // 默认使用LINK代币进行检测
          const token = 'LINK';
          const duskoResult = await dispatch(
            duskoApi.endpoints.getCreditScore.initiate({
              token,
              address,
              originalScore: ethScore.credit_score
            })
          ).unwrap();
          
          // 作为备用，仍然获取原来的对敏交易检测结果
          const washTradeResult = await dispatch(
            washTradeApi.endpoints.checkBlacklist.initiate(address)
          ).unwrap();
          
          // 3. 计算综合评分
          // 使用Dusko返回的调整后的评分
          const baseScore = ethScore.credit_score; // ETH系统的基础分
          const adjustedScore = duskoResult.adjusted_score; // Dusko调整后的分数
          
          // 对敏交易扣分逻辑
          const washTradePenalty = duskoResult.penalty; // 使用Dusko的惩罚分数
          
          // 最终分数 - 使用Dusko调整后的分数
          const finalScore = adjustedScore;
          
          // 使用Dusko的风险评级
          let riskLevel: 'low' | 'medium' | 'high' | 'very_high';
          if (duskoResult.recommendation.lending_risk === 'high') {
            riskLevel = 'high';
          } else if (finalScore >= 80) {
            riskLevel = 'low';
          } else if (finalScore >= 60) {
            riskLevel = 'medium';
          } else if (finalScore >= 40) {
            riskLevel = 'high';
          } else {
            riskLevel = 'very_high';
          }
          
          // 计算推荐利率 - 使用Dusko的利率调整
          const baseInterestRate = 5; // 基础利率 5%
          const recommendedInterestRate = baseInterestRate + duskoResult.recommendation.interest_rate_adjustment;
          
          // 计算最大贷款额度 - 使用Dusko的建议额度
          const maxLoanAmount = duskoResult.recommendation.max_loan_amount;
          
          // 生成评分解释
          let explanation = `基础信用评分: ${baseScore}分。`;
          if (duskoResult.wash_trade_data.detected) {
            explanation += ` Dusko检测到对敏交易行为，交易次数: ${duskoResult.wash_trade_data.count}, 交易量: ${duskoResult.wash_trade_data.volume}, 扣除${washTradePenalty}分。`;
          } else {
            explanation += ' Dusko未检测到对敏交易行为。';
          }
          explanation += ` 最终评分: ${finalScore}分。`;
          
          // 返回综合结果
          return {
            data: {
              address,
              ethScore,
              washTradeStatus: {
                detected: duskoResult.wash_trade_data.detected,
                penalty: duskoResult.penalty,
                count: duskoResult.wash_trade_data.count,
                volume: duskoResult.wash_trade_data.volume
              },
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
