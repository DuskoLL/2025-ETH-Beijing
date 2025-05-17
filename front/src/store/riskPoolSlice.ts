import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RiskPoolState {
  totalBalance: string;
  isLoading: boolean;
  transactions: Array<{
    type: 'interest' | 'penalty' | 'compensation';
    amount: string;
    timestamp: number;
    txHash: string;
  }>;
}

const initialState: RiskPoolState = {
  totalBalance: '0',
  isLoading: false,
  transactions: []
};

const riskPoolSlice = createSlice({
  name: 'riskPool',
  initialState,
  reducers: {
    setRiskPoolLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateRiskPoolInfo: (state, action: PayloadAction<Partial<RiskPoolState>>) => {
      return { ...state, ...action.payload };
    },
    addRiskPoolTransaction: (state, action: PayloadAction<RiskPoolState['transactions'][0]>) => {
      state.transactions.unshift(action.payload);
    },
    resetRiskPool: () => initialState
  }
});

export const {
  setRiskPoolLoading,
  updateRiskPoolInfo,
  addRiskPoolTransaction,
  resetRiskPool
} = riskPoolSlice.actions;

export default riskPoolSlice.reducer;
