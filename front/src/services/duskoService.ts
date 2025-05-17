import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Dusko API服务接口
export interface DuskoCheckResponse {
  address: string;
  token: string;
  is_blacklisted: boolean;
  info: any;
}

export interface DuskoCreditResponse {
  address: string;
  token: string;
  original_score: number;
  adjusted_score: number;
  penalty: number;
  recommendation: {
    lending_risk: string;
    max_loan_amount: number;
    interest_rate_adjustment: number;
  };
  wash_trade_data: {
    detected: boolean;
    count: number;
    volume: number;
  };
}

export const duskoApi = createApi({
  reducerPath: 'duskoApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5001/api' }),
  endpoints: (builder) => ({
    checkAddress: builder.query<DuskoCheckResponse, { token: string; address: string }>({
      query: ({ token, address }) => `check/${token}/${address}`,
    }),
    getCreditScore: builder.query<DuskoCreditResponse, { token: string; address: string; originalScore: number }>({
      query: ({ token, address, originalScore }) => `credit/${token}/${address}/${originalScore}`,
    }),
  }),
});

export const { useCheckAddressQuery, useGetCreditScoreQuery } = duskoApi;
