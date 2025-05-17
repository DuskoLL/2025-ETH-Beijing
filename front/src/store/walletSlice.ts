import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TokenBalance {
  symbol: string;
  name: string;
  address: string;
  balance: string;
  decimals: number;
  formattedBalance: string;
}

export interface Transaction {
  hash: string;
  timestamp: number;
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  status: 'success' | 'failed' | 'pending';
  type: 'send' | 'receive' | 'contract';
}

interface WalletState {
  address: string | null;
  isConnected: boolean;
  balance: string;
  formattedBalance: string;
  chainId: string | null;
  tokenBalances: TokenBalance[];
  transactions: Transaction[];
  isLoadingTokens: boolean;
  isLoadingTransactions: boolean;
  isLoadingBalance: boolean;
}

const initialState: WalletState = {
  address: null,
  isConnected: false,
  balance: '0',
  formattedBalance: '0.000000',
  chainId: null,
  tokenBalances: [],
  transactions: [],
  isLoadingTokens: false,
  isLoadingTransactions: false,
  isLoadingBalance: false,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWallet: (state, action: PayloadAction<{
      address: string;
      balance: string;
      chainId: string;
    }>) => {
      state.address = action.payload.address;
      state.balance = action.payload.balance;
      state.chainId = action.payload.chainId;
      state.isConnected = true;
    },
    disconnectWallet: (state) => {
      state.address = null;
      state.balance = '0';
      state.chainId = null;
      state.isConnected = false;
      state.tokenBalances = [];
      state.transactions = [];
      state.isLoadingTokens = false;
      state.isLoadingTransactions = false;
    },
    updateBalance: (state, action: PayloadAction<{balance: string; formattedBalance: string}>) => {
      state.balance = action.payload.balance;
      state.formattedBalance = action.payload.formattedBalance;
    },
    setBalanceLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoadingBalance = action.payload;
    },
    setTokenBalancesLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoadingTokens = action.payload;
    },
    updateTokenBalances: (state, action: PayloadAction<TokenBalance[]>) => {
      state.tokenBalances = action.payload;
      state.isLoadingTokens = false;
    },
    setTransactionsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoadingTransactions = action.payload;
    },
    updateTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
      state.isLoadingTransactions = false;
    },
  },
});

export const { 
  setWallet, 
  disconnectWallet, 
  updateBalance,
  setBalanceLoading,
  setTokenBalancesLoading,
  updateTokenBalances,
  setTransactionsLoading,
  updateTransactions
} = walletSlice.actions;
export default walletSlice.reducer;
