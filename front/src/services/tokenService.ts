import { ethers } from 'ethers';
import walletService from './walletService';

// ERC20代币ABI（只包含我们需要的函数）
const ERC20_ABI = [
  // 查询余额
  'function balanceOf(address owner) view returns (uint256)',
  // 查询代币名称
  'function name() view returns (string)',
  // 查询代币符号
  'function symbol() view returns (string)',
  // 查询代币精度
  'function decimals() view returns (uint8)',
  // 转账方法
  'function transfer(address to, uint amount) returns (bool)',
  // 授权方法
  'function approve(address spender, uint256 amount) returns (bool)',
  // 查询授权额度
  'function allowance(address owner, address spender) view returns (uint256)',
];

// 常用稳定币地址（根据不同网络有所不同）
const STABLECOIN_ADDRESSES: Record<string, Record<string, string>> = {
  // Ethereum Mainnet
  '1': {
    'USDC': '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    'USDT': '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    'DAI': '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  },
  // Goerli Testnet
  '5': {
    'USDC': '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
    'USDT': '0x509ee0d083ddf8ac028f2a56731412edd63223b9',
    'DAI': '0x73967c6a0904aa032c103b4104747e88c566b1a2',
  },
  // Sepolia Testnet
  '11155111': {
    'USDC': '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', // 示例地址，可能需要更新
    'USDT': '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06', // 示例地址，可能需要更新
    'DAI': '0x3e622317f8C93f7328350cF0B56d9eD4C620C5d6',  // 示例地址，可能需要更新
  },
};

export interface TokenInfo {
  symbol: string;
  name: string;
  address: string;
  balance: string;
  decimals: number;
  formattedBalance: string;
}

class TokenService {
  // 获取稳定币余额
  public async getStablecoinBalances(address: string, chainId: string): Promise<TokenInfo[]> {
    try {
      if (!address || !chainId) {
        return [];
      }

      const provider = walletService.getProvider();
      if (!provider) {
        throw new Error('未连接钱包');
      }

      const stablecoins = STABLECOIN_ADDRESSES[chainId] || {};
      const tokenPromises = Object.entries(stablecoins).map(async ([symbol, tokenAddress]) => {
        try {
          const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
          const balance = await tokenContract.balanceOf(address);
          const name = await tokenContract.name();
          const decimals = await tokenContract.decimals();
          
          // 格式化余额（考虑代币精度）
          const formattedBalance = ethers.formatUnits(balance, decimals);
          
          return {
            symbol,
            name,
            address: tokenAddress,
            balance: balance.toString(),
            decimals,
            formattedBalance
          };
        } catch (error) {
          console.error(`获取${symbol}余额失败:`, error);
          return null;
        }
      });

      const results = await Promise.all(tokenPromises);
      return results.filter((token): token is TokenInfo => token !== null);
    } catch (error) {
      console.error('获取稳定币余额失败:', error);
      return [];
    }
  }

  // 获取特定代币余额
  public async getTokenBalance(tokenAddress: string, walletAddress: string): Promise<TokenInfo | null> {
    try {
      const provider = walletService.getProvider();
      if (!provider) {
        throw new Error('未连接钱包');
      }

      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
      const balance = await tokenContract.balanceOf(walletAddress);
      const name = await tokenContract.name();
      const symbol = await tokenContract.symbol();
      const decimals = await tokenContract.decimals();
      
      // 格式化余额
      const formattedBalance = ethers.formatUnits(balance, decimals);
      
      return {
        symbol,
        name,
        address: tokenAddress,
        balance: balance.toString(),
        decimals,
        formattedBalance
      };
    } catch (error) {
      console.error('获取代币余额失败:', error);
      return null;
    }
  }

  // 获取代币价格（这里使用模拟数据，实际应用中可以接入价格API）
  public getTokenPrice(symbol: string): number {
    const prices: Record<string, number> = {
      'USDC': 1.0,
      'USDT': 1.0,
      'DAI': 1.0,
      'ETH': 1800.0, // 示例价格
    };
    
    return prices[symbol] || 0;
  }
}

const tokenService = new TokenService();
export default tokenService;
