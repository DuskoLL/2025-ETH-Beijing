import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// WTEYE API服务接口
export interface WashTradeStatus {
  detected: boolean;
  penalty: number;
  info?: {
    count: number;
    volume: number;
    first_detected: string;
    last_detected: string;
  };
}

export interface CreditRecommendation {
  lending_risk: 'low' | 'medium' | 'high';
  max_loan_amount_factor: number;
  interest_rate_increase: number;
}

export interface CreditScoreResult {
  address: string;
  timestamp: string;
  wash_trade_check: WashTradeStatus;
  recommendation: CreditRecommendation;
}

export interface BlacklistEntry {
  address: string;
  token: string;
  date_added: string;
  wash_trade_count: number;
  wash_trade_volume: number;
}

// 创建RTK Query API
export const washTradeApi = createApi({
  reducerPath: 'washTradeApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5001/api' }), // Dusko-implementation API
  endpoints: (builder) => ({
    // 检查地址是否在黑名单中
    checkBlacklist: builder.query<WashTradeStatus, string>({
      query: (address) => `/blacklist/check/${address}`,
    }),
    
    // 获取调整后的信用评分
    getAdjustedCreditScore: builder.query<CreditScoreResult, { address: string, originalScore: number, token: string }>({
      query: ({ address, originalScore, token }) => 
        `/credit/score?address=${address}&original_score=${originalScore}&token=${token}`,
    }),
    
    // 获取黑名单列表
    getBlacklist: builder.query<BlacklistEntry[], string>({
      query: (token) => `/blacklist?token=${token}`,
    }),
    
    // 添加地址到黑名单
    addToBlacklist: builder.mutation<{ success: boolean }, { address: string, token: string }>({
      query: ({ address, token }) => ({
        url: `/blacklist/add`,
        method: 'POST',
        body: { address, token },
      }),
    }),
    
    // 从黑名单中移除地址
    removeFromBlacklist: builder.mutation<{ success: boolean }, { address: string, token: string }>({
      query: ({ address, token }) => ({
        url: `/blacklist/remove`,
        method: 'POST',
        body: { address, token },
      }),
    }),
  }),
});

// 导出生成的hooks
export const {
  useCheckBlacklistQuery,
  useGetAdjustedCreditScoreQuery,
  useGetBlacklistQuery,
  useAddToBlacklistMutation,
  useRemoveFromBlacklistMutation,
} = washTradeApi;
