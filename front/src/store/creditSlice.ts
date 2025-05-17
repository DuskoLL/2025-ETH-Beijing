import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CreditState {
  score: number;
  level: string;
  factors: {
    tokenStaking: number;
    aiScore: number;
    activity: number;
    governanceTokens: number;
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: CreditState = {
  score: 0,
  level: '',
  factors: {
    tokenStaking: 0,
    aiScore: 0,
    activity: 0,
    governanceTokens: 0,
  },
  isLoading: false,
  error: null,
};

const creditSlice = createSlice({
  name: 'credit',
  initialState,
  reducers: {
    checkCreditScore: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setCreditScore: (state, action: PayloadAction<{
      score: number;
      level: string;
      factors: CreditState['factors'];
    }>) => {
      state.score = action.payload.score;
      state.level = action.payload.level;
      state.factors = action.payload.factors;
      state.isLoading = false;
    },
    setCreditError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    resetCreditScore: (state) => {
      state.score = 0;
      state.level = '';
      state.factors = initialState.factors;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  checkCreditScore,
  setCreditScore,
  setCreditError,
  resetCreditScore,
} = creditSlice.actions;

export default creditSlice.reducer;
