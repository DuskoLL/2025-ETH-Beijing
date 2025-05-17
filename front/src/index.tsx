import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './store/index';

// React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 自定义组件
import { ContractProvider } from './contracts/ContractProvider';

// 创建 React Query 客户端

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ContractProvider>
          <App />
        </ContractProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
