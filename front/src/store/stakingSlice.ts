import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StakingState {
  stakedAmount: string;
  rewards: string;
  penalties: string;
  isLoading: boolean;
  transactions: Array<{
    type: 'stake' | 'unstake' | 'claim' | 'penalty';
    amount: string;
    timestamp: number;
    txHash: string;
  }>;
}

const initialState: StakingState = {
  stakedAmount: '0',
  rewards: '0',
  penalties: '0',
  isLoading: false,
  transactions: []
};

const stakingSlice = createSlice({
  name: 'staking',
  initialState,
  reducers: {
    setStakingLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateStakingInfo: (state, action: PayloadAction<Partial<StakingState>>) => {
      return { ...state, ...action.payload };
    },
    addStakingTransaction: (state, action: PayloadAction<StakingState['transactions'][0]>) => {
      state.transactions.unshift(action.payload);
    },
    resetStaking: () => initialState
  }
});

export const {
  setStakingLoading,
  updateStakingInfo,
  addStakingTransaction,
  resetStaking
} = stakingSlice.actions;

export default stakingSlice.reducer;
