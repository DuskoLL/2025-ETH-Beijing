import { useAccount, useBalance, useChainId } from 'wagmi';
import { SUPPORTED_TOKENS, TOKEN_ABI, SUPPORTED_CHAINS } from '../config/wagmi';
import { useEffect, useState } from 'react';
import { formatUnits } from 'viem';

export interface TokenBalance {
  symbol: string;
  name: string;
  address: string;
  balance: string;
  formattedBalance: string;
  decimals: number;
}

export function useWalletInfo() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balanceData, isLoading: isBalanceLoading } = useBalance({
    address: address as `0x${string}` | undefined
  });
  
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [isTokenBalancesLoading, setIsTokenBalancesLoading] = useState(false);
  
  // 获取当前链的键名
  const getChainKey = (chainId: number): string => {
    const chain = SUPPORTED_CHAINS.find(c => c.id === chainId);
    return chain ? chain.key : 'ethereum'; // 默认返回ethereum
  };
  
  // 获取代币余额
  useEffect(() => {
    const fetchTokenBalances = async () => {
      if (!address || !isConnected || !chainId) {
        setTokenBalances([]);
        return;
      }
      
      setIsTokenBalancesLoading(true);
      
      try {
        const chainKey = getChainKey(chainId);
        const tokens = SUPPORTED_TOKENS[chainKey] || [];
        
        // 如果没有代币，则返回空数组
        if (tokens.length === 0) {
          setTokenBalances([]);
          setIsTokenBalancesLoading(false);
          return;
        }
        
        // 使用简化的方法获取代币余额
        const tokenBalancesData: TokenBalance[] = [];
        
        for (const token of tokens) {
          try {
            // 模拟代币余额数据，实际项目中应该使用真实的API调用
            const mockBalance = '1000000000000000000'; // 模拟1个代币的余额
            const formattedBalance = formatUnits(BigInt(mockBalance), token.decimals);
            
            tokenBalancesData.push({
              symbol: token.symbol,
              name: token.name,
              address: token.address,
              balance: mockBalance,
              formattedBalance,
              decimals: token.decimals,
            });
          } catch (error) {
            console.error(`获取${token.symbol}余额失败:`, error);
          }
        }
        
        setTokenBalances(tokenBalancesData);
      } catch (error) {
        console.error('获取代币余额失败:', error);
      } finally {
        setIsTokenBalancesLoading(false);
      }
    };
    
    fetchTokenBalances();
  }, [address, isConnected, chainId]);
  
  // 获取当前链的信息
  const chainInfo = SUPPORTED_CHAINS.find(chain => chain.id === chainId) || SUPPORTED_CHAINS[0];
  
  return {
    address,
    isConnected,
    chainId,
    chainInfo,
    balance: balanceData?.value.toString() || '0',
    formattedBalance: balanceData?.formatted || '0',
    tokenBalances,
    isBalanceLoading,
    isTokenBalancesLoading,
  };
}
