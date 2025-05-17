import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { washTradeApi } from '../services/washTradeService';
import { combinedScoreApi } from '../services/combinedScoreService';
import { duskoApi } from '../services/duskoService';
import walletReducer from './walletSlice';

export const store = configureStore({
  reducer: {
    // 添加API reducers
    [washTradeApi.reducerPath]: washTradeApi.reducer,
    [combinedScoreApi.reducerPath]: combinedScoreApi.reducer,
    [duskoApi.reducerPath]: duskoApi.reducer,
    wallet: walletReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(washTradeApi.middleware)
      .concat(combinedScoreApi.middleware)
      .concat(duskoApi.middleware),
});

// 设置监听器，用于refetchOnFocus和refetchOnReconnect功能
setupListeners(store.dispatch);

// 导出类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
