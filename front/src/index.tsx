import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './store/index';

// 暂时移除 Wagmi 配置
// import { WagmiProvider, createConfig } from 'wagmi';
// import { mainnet, sepolia } from 'wagmi/chains';
// import { http } from 'viem';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 暂时移除 wagmi 配置
// const config = createConfig({
//   chains: [mainnet, sepolia],
//   transports: {
//     [mainnet.id]: http(),
//     [sepolia.id]: http(),
//   },
// });

// 暂时移除 React Query 客户端
// const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
