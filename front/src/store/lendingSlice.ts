import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Loan {
  id: string;
  amount: number;
  duration: number;
  rate: number;
  status: 'pending' | 'active' | 'repaid' | 'defaulted';
  timestamp: string;
}

interface LendingState {
  loans: Loan[];
  activeLoan: Loan | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: LendingState = {
  loans: [],
  activeLoan: null,
  isLoading: false,
  error: null,
};

const lendingSlice = createSlice({
  name: 'lending',
  initialState,
  reducers: {
    createLoan: (state, action: PayloadAction<{
      amount: number;
      duration: number;
      rate: number;
    }>) => {
      const newLoan: Loan = {
        id: Date.now().toString(),
        amount: action.payload.amount,
        duration: action.payload.duration,
        rate: action.payload.rate,
        status: 'pending',
        timestamp: new Date().toISOString(),
      };
      state.loans.push(newLoan);
      state.activeLoan = newLoan;
    },
    updateLoanStatus: (state, action: PayloadAction<{
      id: string;
      status: Loan['status'];
    }>) => {
      const loanIndex = state.loans.findIndex(l => l.id === action.payload.id);
      if (loanIndex !== -1) {
        state.loans[loanIndex].status = action.payload.status;
        if (action.payload.status !== 'pending') {
          state.activeLoan = null;
        }
      }
    },
    setLendingError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    resetLending: (state) => {
      state.loans = [];
      state.activeLoan = null;
      state.error = null;
    },
  },
});

export const {
  createLoan,
  updateLoanStatus,
  setLendingError,
  resetLending,
} = lendingSlice.actions;

export default lendingSlice.reducer;
