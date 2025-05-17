import { useState, useCallback, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { sepolia } from 'wagmi/chains';
import { 
  CORE_LENDING_ADDRESS, 
  CORE_LENDING_ABI, 
  LENDING_POOL_ADDRESS, 
  LENDING_POOL_ABI,
  getEtherscanLink
} from './contractConfig';

// 借款相关 Hook
export const useLending = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [interestRate, setInterestRate] = useState(10);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  
  // 写入合约
  const { writeContractAsync } = useWriteContract();
  
  // 交易状态监控
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
    query: {
      enabled: Boolean(txHash),
    },
  });
  
  // 监控交易状态
  useEffect(() => {
    if (isConfirming) {
      setTxStatus('pending');
    } else if (isConfirmed) {
      setTxStatus('success');
      // 交易成功后刷新贷款列表
      fetchLoans();
    }
  }, [isConfirming, isConfirmed]);
  
  // 读取用户贷款
  const { data: userLoans, refetch } = useReadContract({
    address: LENDING_POOL_ADDRESS as `0x${string}`,
    abi: LENDING_POOL_ABI,
    functionName: 'getUserLoans',
    args: address ? [address] : undefined,
  });
  
  // 获取用户贷款
  const fetchLoans = useCallback(async () => {
    if (!isConnected || !address) return;
    
    try {
      setLoading(true);
      
      // 刷新合约数据
      await refetch();
      
      // 如果有合约数据，则格式化并更新状态
      if (userLoans && Array.isArray(userLoans)) {
        const formattedLoans = userLoans.map((loan: any, index: number) => ({
          id: index,
          amount: formatEther(loan.amount),
          collateral: formatEther(loan.collateral),
          dueTime: Number(loan.dueTime) * 1000, // 转换为毫秒
          liquidated: loan.liquidated,
          borrower: loan.borrower
        }));
        
        setLoans(formattedLoans);
      }
    } catch (error) {
      console.error('获取贷款失败:', error);
    } finally {
      setLoading(false);
    }
  }, [isConnected, address, userLoans, refetch]);
  
  // 初始加载
  useEffect(() => {
    if (isConnected && address) {
      fetchLoans();
    }
  }, [isConnected, address, fetchLoans]);
  
  // 借款 - 支持抵押品
  const borrow = useCallback(async (amount: string, collateralAmount: string, duration: number) => {
    if (!isConnected || !address) {
      throw new Error('钱包未连接');
    }

    try {
      setTxStatus('pending');
      console.log(`调用借款函数: 金额=${amount}, 抵押品=${collateralAmount}, 期限=${duration}`);
      
      const amountInWei = parseEther(amount);
      const collateralInWei = parseEther(collateralAmount);
      
      // 调用合约
      const hash = await writeContractAsync({
        address: CORE_LENDING_ADDRESS as `0x${string}`,
        abi: CORE_LENDING_ABI,
        functionName: 'borrow',
        args: [amountInWei, collateralInWei, BigInt(duration)],
        account: address,
        chain: sepolia,
      });
      
      setTxHash(hash);
      return { hash, etherscanLink: getEtherscanLink(hash) };
    } catch (error) {
      console.error('借款失败:', error);
      setTxStatus('error');
      throw error;
    }
  }, [isConnected, address, writeContractAsync]);
  
  // 无抵押借款
  const borrowWithoutCollateral = useCallback(async (amount: string, duration: number) => {
    if (!isConnected || !address) {
      throw new Error('钱包未连接');
    }

    try {
      setTxStatus('pending');
      console.log(`调用无抵押借款函数: 金额=${amount}, 期限=${duration}`);
      
      const amountInWei = parseEther(amount);
      
      // 调用合约
      const hash = await writeContractAsync({
        address: CORE_LENDING_ADDRESS as `0x${string}`,
        abi: CORE_LENDING_ABI,
        functionName: 'borrowWithoutCollateral',
        args: [amountInWei, BigInt(duration)],
        account: address,
        chain: sepolia,
      });
      
      setTxHash(hash);
      return { hash, etherscanLink: getEtherscanLink(hash) };
    } catch (error) {
      console.error('无抵押借款失败:', error);
      setTxStatus('error');
      throw error;
    }
  }, [isConnected, address, writeContractAsync]);

  // 还款
  const repay = useCallback(async (loanId: number) => {
    if (!isConnected || !address) {
      throw new Error('钱包未连接');
    }
    
    try {
      setTxStatus('pending');
      
      // 调用合约
      const hash = await writeContractAsync({
        address: CORE_LENDING_ADDRESS as `0x${string}`,
        abi: CORE_LENDING_ABI,
        functionName: 'repay',
        args: [BigInt(loanId)],
        account: address,
        chain: sepolia,
      });
      
      setTxHash(hash);
      return { hash, etherscanLink: getEtherscanLink(hash) };
    } catch (error) {
      console.error('还款失败:', error);
      setTxStatus('error');
      throw error;
    }
  }, [isConnected, address, writeContractAsync]);

  return {
    loans,
    loading,
    interestRate,
    txStatus,
    txHash,
    isConfirming,
    isConfirmed,
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
    if (!isConnected || !address) return;
    
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
  }, [isConnected, address]);

  // 初始加载
  useEffect(() => {
    if (isConnected && address) {
      fetchBalances();
    }
  }, [isConnected, address, fetchBalances]);

  return {
    balances,
    loading,
    fetchBalances
  };
};

// 黑名单相关 Hook
export const useBlacklist = () => {
  const { address, isConnected } = useAccount();
  const [isBlacklisted, setIsBlacklisted] = useState(false);
  const [loading, setLoading] = useState(false);

  // 检查是否被列入黑名单
  const checkBlacklist = useCallback(async () => {
    if (!address || !isConnected) return;
    
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
  }, [address, isConnected]);

  // 初始加载
  useEffect(() => {
    if (isConnected && address) {
      checkBlacklist();
    }
  }, [isConnected, address, checkBlacklist]);

  return {
    isBlacklisted,
    loading,
    checkBlacklist
  };
};
