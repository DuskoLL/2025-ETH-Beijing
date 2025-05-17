import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  balance: string;
  chainId: string | null;
}

const initialState: WalletState = {
  address: null,
  isConnected: false,
  balance: '0',
  chainId: null,
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
    },
    updateBalance: (state, action: PayloadAction<string>) => {
      state.balance = action.payload;
    },
  },
});

export const { setWallet, disconnectWallet, updateBalance } = walletSlice.actions;
export default walletSlice.reducer;
