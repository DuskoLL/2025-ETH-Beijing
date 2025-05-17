import { configureStore } from '@reduxjs/toolkit';
import walletReducer from './walletSlice';
import creditReducer from './creditSlice';
import lendingReducer from './lendingSlice';
import riskPoolReducer from './riskPoolSlice';
import stakingReducer from './stakingSlice';

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    credit: creditReducer,
    lending: lendingReducer,
    riskPool: riskPoolReducer,
    staking: stakingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
