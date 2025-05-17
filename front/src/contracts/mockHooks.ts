import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';

// 模拟钱包账户
export const useAccount = () => {
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [isConnected, setIsConnected] = useState(false);

  // 从localStorage获取保存的地址
  useEffect(() => {
    const savedAddress = localStorage.getItem('walletAddress');
    if (savedAddress) {
      setAddress(savedAddress);
      setIsConnected(true);
    }
  }, []);

  // 监听钱包连接事件
  useEffect(() => {
    const handleWalletConnect = (event: CustomEvent) => {
      if (event.detail && event.detail.address) {
        setAddress(event.detail.address);
        setIsConnected(true);
        localStorage.setItem('walletAddress', event.detail.address);
      }
    };

    const handleWalletDisconnect = () => {
      setAddress(undefined);
      setIsConnected(false);
      localStorage.removeItem('walletAddress');
    };

    window.addEventListener('wallet-connected', handleWalletConnect as EventListener);
    window.addEventListener('wallet-disconnected', handleWalletDisconnect);

    return () => {
      window.removeEventListener('wallet-connected', handleWalletConnect as EventListener);
      window.removeEventListener('wallet-disconnected', handleWalletDisconnect);
    };
  }, []);

  return {
    address,
    isConnected,
    status: isConnected ? 'connected' : 'disconnected',
  };
};

// 模拟合约实例
export const useContracts = () => {
  const { address, isConnected } = useAccount();
  const [contracts, setContracts] = useState<{
    coreLending: any | null;
    lendingPool: any | null;
    blackList: any | null;
    auctionManager: any | null;
    tokenA: any | null;
    tokenB: any | null;
  }>({
    coreLending: null,
    lendingPool: null,
    blackList: null,
    auctionManager: null,
    tokenA: null,
    tokenB: null,
  });

  // 模拟合约初始化
  useEffect(() => {
    // 创建模拟合约对象
    const mockContract = {
      target: '0x1234567890123456789012345678901234567890',
      allowance: async () => ethers.parseEther('1000'),
      approve: async () => ({ wait: async () => ({}) }),
      balanceOf: async () => ethers.parseEther('100'),
      borrow: async () => ({ wait: async () => ({}) }),
      repay: async () => ({ wait: async () => ({}) }),
      INTEREST_RATE: async () => 10,
      getLoans: async () => [],
      getLoan: async () => ({
        amount: ethers.parseEther('100'),
        collateral: ethers.parseEther('150'),
        dueTime: Date.now() + 30 * 24 * 60 * 60 * 1000,
        liquidated: false,
        borrower: address
      }),
      isBlacklisted: async () => false
    };

    if (isConnected) {
      setContracts({
        coreLending: mockContract,
        lendingPool: mockContract,
        blackList: mockContract,
        auctionManager: mockContract,
        tokenA: mockContract,
        tokenB: mockContract,
      });
    }
  }, [isConnected, address]);

  return contracts;
};

// 借款相关 Hook
export const useLending = () => {
  const { coreLending, lendingPool } = useContracts();
  const { address, isConnected } = useAccount();
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [interestRate, setInterestRate] = useState(10);

  // 模拟获取用户贷款
  const fetchLoans = useCallback(async () => {
    if (!isConnected) return;
    
    try {
      setLoading(true);
      // 模拟数据
      const mockLoans = [
        {
          id: '1',
          amount: ethers.parseEther('1000'),
          collateral: ethers.parseEther('1500'),
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

  // 模拟借款 - 支持无抵押借款
  const borrow = useCallback(async (amount: string, collateralAmount: string, duration: number) => {
    if (!isConnected) {
      throw new Error('钱包未连接');
    }

    try {
      console.log(`调用借款函数: 金额=${amount}, 抵押品=${collateralAmount}, 期限=${duration}`);
      // 模拟调用智能合约的borrowWithoutCollateral函数
      // 在真实环境中，这里将调用修改后的智能合约
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { hash: '0x' + Math.random().toString(16).substring(2, 42) };
    } catch (error) {
      console.error('借款失败:', error);
      throw error;
    }
  }, [isConnected]);
  
  // 添加无抵押借款函数
  const borrowWithoutCollateral = useCallback(async (amount: string, duration: number) => {
    if (!isConnected) {
      throw new Error('钱包未连接');
    }

    try {
      console.log(`调用无抵押借款函数: 金额=${amount}, 期限=${duration}`);
      // 模拟调用智能合约的borrowWithoutCollateral函数
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { hash: '0x' + Math.random().toString(16).substring(2, 42) };
    } catch (error) {
      console.error('无抵押借款失败:', error);
      throw error;
    }
  }, [isConnected]);

  // 模拟还款
  const repay = useCallback(async (loanId: number) => {
    if (!isConnected) {
      throw new Error('钱包未连接');
    }

    try {
      // 模拟交易
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { hash: '0x' + Math.random().toString(16).substring(2, 42) };
    } catch (error) {
      console.error('还款失败:', error);
      throw error;
    }
  }, [isConnected]);

  // 初始化
  useEffect(() => {
    if (isConnected) {
      fetchLoans();
    }
  }, [isConnected, fetchLoans]);

  return {
    loans,
    loading,
    interestRate,
    borrow,
    borrowWithoutCollateral, // 导出无抵押借款函数
    repay,
    fetchLoans,
  };
};

// 代币相关 Hook
export const useTokens = () => {
  const { isConnected } = useAccount();
  const [balances, setBalances] = useState({
    tokenA: '1000',
    tokenB: '10',
  });
  const [loading, setLoading] = useState(false);

  // 模拟获取代币余额
  const fetchBalances = useCallback(async () => {
    if (!isConnected) return;
    
    try {
      setLoading(true);
      // 模拟数据
      setBalances({
        tokenA: '1000', // USDC
        tokenB: '10',   // ETH
      });
    } catch (error) {
      console.error('获取余额失败:', error);
    } finally {
      setLoading(false);
    }
  }, [isConnected]);

  // 初始化
  useEffect(() => {
    if (isConnected) {
      fetchBalances();
    }
  }, [isConnected, fetchBalances]);

  return {
    balances,
    loading,
    fetchBalances,
  };
};

// 黑名单相关 Hook
export const useBlacklist = () => {
  const [isBlacklisted, setIsBlacklisted] = useState(false);
  const [loading, setLoading] = useState(false);

  // 模拟检查黑名单
  const checkBlacklist = useCallback(async (address: string) => {
    try {
      setLoading(true);
      // 模拟检查，始终返回false
      setIsBlacklisted(false);
    } catch (error) {
      console.error('检查黑名单失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    isBlacklisted,
    loading,
    checkBlacklist,
  };
};
