import { mainnet, sepolia } from 'wagmi/chains';
import { http } from 'viem';

// 支持的区块链网络
export const SUPPORTED_CHAINS = [
  {
    id: 1,
    name: '以太坊主网',
    key: 'ethereum',
    rpcUrl: 'https://eth.llamarpc.com',
    blockExplorer: 'https://etherscan.io',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      price: 0, // 初始化为0，将由实时数据更新
      coingeckoId: 'ethereum'
    }
  },
  {
    id: 11155111,
    name: 'Sepolia测试网',
    key: 'sepolia',
    rpcUrl: 'https://rpc.sepolia.org',
    blockExplorer: 'https://sepolia.etherscan.io',
    isTestnet: true,
    nativeCurrency: {
      name: 'Sepolia Ether', 
      symbol: 'ETH',
      decimals: 18,
      price: 0, // 初始化为0，将由实时数据更新
      coingeckoId: 'ethereum'
    }
  }
];

// wagmi v2 配置 - 最简单的配置
export const config = {
  chains: [mainnet, sepolia] as const,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  }
};

// 其余定义可继续保留（如SUPPORTED_CHAINS等）

// 支持的代币
export interface TokenInfo {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  chainId: number;
  chainKey: string;
  price: number;
  coingeckoId?: string;
  lastUpdated?: number;
}

// 定义常用稳定币地址
export const SUPPORTED_TOKENS: { [key: string]: TokenInfo[] } = {
  ethereum: [
    {
      symbol: 'USDT',
      name: 'Tether USD',
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      decimals: 6,
      chainId: 1,
      chainKey: 'ethereum',
      price: 0,
      coingeckoId: 'tether'
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      decimals: 6,
      chainId: 1,
      chainKey: 'ethereum',
      price: 0,
      coingeckoId: 'usd-coin'
    },
    {
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      decimals: 18,
      chainId: 1,
      chainKey: 'ethereum',
      price: 0,
      coingeckoId: 'dai'
    }
  ],
  sepolia: [
    {
      symbol: 'USDC',
      name: 'USD Coin',
      address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
      decimals: 6,
      chainId: 11155111,
      chainKey: 'sepolia',
      price: 0,
      coingeckoId: 'usd-coin'
    },
    {
      symbol: 'USDT',
      name: 'Tether USD',
      address: '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06',
      decimals: 6,
      chainId: 11155111,
      chainKey: 'sepolia',
      price: 0,
      coingeckoId: 'tether'
    },
    {
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      address: '0x3e622317f8C93f7328350cF0B56d9eD4C620C5d6',
      decimals: 18,
      chainId: 11155111,
      chainKey: 'sepolia',
      price: 0,
      coingeckoId: 'dai'
    }
  ]
};

// ERC20代币ABI
export const TOKEN_ABI = [
  // 查询余额
  'function balanceOf(address owner) view returns (uint256)',
  // 查询代币名称
  'function name() view returns (string)',
  // 查询代币符号
  'function symbol() view returns (string)',
  // 查询代币精度
  'function decimals() view returns (uint8)',
  // 转账
  'function transfer(address to, uint amount) returns (bool)',
  // 授权
  'function approve(address spender, uint256 amount) returns (bool)',
  // 查询授权额度
  'function allowance(address owner, address spender) view returns (uint256)',
];
