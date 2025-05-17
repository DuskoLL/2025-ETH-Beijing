import { useState, useCallback, useEffect } from 'react';
import contractService from './contractService';
import { ethers } from 'ethers';

// 使用真实的钱包账户
export const useAccount = () => {
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            setIsConnected(true);
          }
        } catch (error) {
          console.error('检查钱包连接失败:', error);
        }
      }
    };
    
    checkConnection();
    
    // 监听账户变化
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
        } else {
          setAddress(undefined);
          setIsConnected(false);
        }
      });
    }
    
    return () => {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);
  
  return {
    address,
    isConnected,
    connectWallet: async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            setIsConnected(true);
            return accounts[0];
          }
        } catch (error) {
          console.error('连接钱包失败:', error);
          throw error;
        }
      } else {
        throw new Error('请安装 MetaMask!');
      }
    }
  };
};

// 借款相关 Hook
export const useLending = () => {
  const { address, isConnected } = useAccount();
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [interestRate, setInterestRate] = useState(10);

  // 获取用户贷款
  const fetchLoans = useCallback(async () => {
    if (!isConnected) return;
    
    try {
      setLoading(true);
      // 这里应该从区块链获取用户贷款信息
      // 目前使用模拟数据，后续应替换为真实数据
      const mockLoans = [
        {
          id: '1',
          amount: ethers.parseEther('1000'),
          collateral: ethers.parseEther('0'),
          dueTime: Date.now() + 30 * 24 * 60 * 60 * 1000,
          liquidated: false,
          borrower: address
        }
      ];
      setLoans(mockLoans);
    } catch (error) {
      console.error('获取贷款失败:', error);
    } finally {
      setLoading(false);
    }
  }, [isConnected, address]);

  // 借款 - 支持抵押品
  const borrow = useCallback(async (amount: string, collateralAmount: string, duration: number) => {
    if (!isConnected) {
      throw new Error('钱包未连接');
    }

    try {
      console.log(`调用借款函数: 金额=${amount}, 抵押品=${collateralAmount}, 期限=${duration}`);
      // 调用合约服务进行借款
      return await contractService.borrow(amount, collateralAmount, duration);
    } catch (error) {
      console.error('借款失败:', error);
      throw error;
    }
  }, [isConnected]);
  
  // 无抵押借款
  const borrowWithoutCollateral = useCallback(async (amount: string, duration: number) => {
    if (!isConnected) {
      throw new Error('钱包未连接');
    }

    try {
      console.log(`调用无抵押借款函数: 金额=${amount}, 期限=${duration}`);
      // 调用合约服务进行无抵押借款
      return await contractService.borrowWithoutCollateral(amount, duration);
    } catch (error) {
      console.error('无抵押借款失败:', error);
      throw error;
    }
  }, [isConnected]);

  // 还款
  const repay = useCallback(async (loanId: number) => {
    if (!isConnected) {
      throw new Error('钱包未连接');
    }
    
    try {
      // 调用合约服务进行还款
      return await contractService.repay(loanId);
    } catch (error) {
      console.error('还款失败:', error);
      throw error;
    }
  }, [isConnected]);

  return {
    loans,
    loading,
    interestRate,
    borrow,
    borrowWithoutCollateral,
    repay,
    fetchLoans,
  };
};

// 代币相关 Hook
export const useTokens = () => {
  const { address, isConnected } = useAccount();
  const [balances, setBalances] = useState({
    tokenA: '0',
    tokenB: '0'
  });
  const [loading, setLoading] = useState(false);

  // 获取代币余额
  const fetchBalances = useCallback(async () => {
    if (!isConnected) return;
    
    try {
      setLoading(true);
      // 这里应该从区块链获取代币余额
      // 目前使用模拟数据，后续应替换为真实数据
      setBalances({
        tokenA: '10000',
        tokenB: '15000'
      });
    } catch (error) {
      console.error('获取余额失败:', error);
    } finally {
      setLoading(false);
    }
  }, [isConnected]);

  return {
    balances,
    loading,
    fetchBalances
  };
};

// 黑名单相关 Hook
export const useBlacklist = () => {
  const { address } = useAccount();
  const [isBlacklisted, setIsBlacklisted] = useState(false);
  const [loading, setLoading] = useState(false);

  // 检查是否被列入黑名单
  const checkBlacklist = useCallback(async () => {
    if (!address) return;
    
    try {
      setLoading(true);
      // 这里应该从区块链检查黑名单状态
      // 目前使用模拟数据，后续应替换为真实数据
      setIsBlacklisted(false);
    } catch (error) {
      console.error('检查黑名单失败:', error);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    checkBlacklist();
  }, [checkBlacklist]);

  return {
    isBlacklisted,
    loading,
    checkBlacklist
  };
};
