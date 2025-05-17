// 导入模拟hooks，替代wagmi hooks
import {
  useAccount,
  useContracts,
  useLending,
  useTokens,
  useBlacklist
} from './mockHooks';

// 导出这些hooks供应用使用
export { useAccount, useContracts, useLending, useTokens, useBlacklist };

// 获取合约实例
export const useContracts = () => {
  const { address, isConnected } = useAccount();
  const [contracts, setContracts] = useState<{
    coreLending: ethers.Contract | null;
    lendingPool: ethers.Contract | null;
    blackList: ethers.Contract | null;
    auctionManager: ethers.Contract | null;
    tokenA: ethers.Contract | null;
    tokenB: ethers.Contract | null;
  }>({
    coreLending: null,
    lendingPool: null,
    blackList: null,
    auctionManager: null,
    tokenA: null,
    tokenB: null,
  });

  useEffect(() => {
    const initContracts = async () => {
      if (!isConnected || !window.ethereum) return;

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const addresses = getContractAddresses();

        // 初始化合约实例
        const coreLending = new ethers.Contract(addresses.coreLending, CORE_LENDING_ABI, signer);
        const lendingPool = new ethers.Contract(addresses.lendingPool, LENDING_POOL_ABI, signer);
        const blackList = new ethers.Contract(addresses.blackList, BLACK_LIST_ABI, signer);
        const auctionManager = new ethers.Contract(addresses.auctionManager, AUCTION_MANAGER_ABI, signer);
        const tokenA = new ethers.Contract(addresses.tokenA, ERC20_ABI, signer);
        const tokenB = new ethers.Contract(addresses.tokenB, ERC20_ABI, signer);

        setContracts({
          coreLending,
          lendingPool,
          blackList,
          auctionManager,
          tokenA,
          tokenB,
        });
      } catch (error) {
        console.error('初始化合约失败:', error);
      }
    };

    initContracts();
  }, [isConnected, address]);

  return contracts;
};

// 借款相关 Hook
export const useLending = () => {
  const { coreLending, lendingPool, tokenA, tokenB } = useContracts();
  const { address, isConnected } = useAccount();
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [interestRate, setInterestRate] = useState(0);

  // 获取用户贷款
  const fetchLoans = useCallback(async () => {
    if (!lendingPool || !address) return;
    
    try {
      setLoading(true);
      const userLoans = await lendingPool.getLoans(address);
      setLoans(userLoans);
    } catch (error) {
      console.error('获取贷款失败:', error);
    } finally {
      setLoading(false);
    }
  }, [lendingPool, address]);

  // 获取利率
  const fetchInterestRate = useCallback(async () => {
    if (!lendingPool) return;
    
    try {
      const rate = await lendingPool.INTEREST_RATE();
      setInterestRate(Number(rate));
    } catch (error) {
      console.error('获取利率失败:', error);
    }
  }, [lendingPool]);

  // 借款
  const borrow = useCallback(async (amount: string, collateralAmount: string, duration: number) => {
    if (!coreLending || !tokenA || !tokenB || !address) {
      throw new Error('合约未初始化或钱包未连接');
    }

    try {
      // 将金额转换为 wei
      const amountWei = ethers.parseUnits(amount, 6); // USDC 是 6 位小数
      const collateralWei = ethers.parseUnits(collateralAmount, 18); // ETH 是 18 位小数
      
      // 检查并授权 tokenB (抵押品)
      const allowance = await tokenB.allowance(address, coreLending.target);
      if (allowance < collateralWei) {
        const approveTx = await tokenB.approve(coreLending.target, collateralWei);
        await approveTx.wait();
      }
      
      // 执行借款
      const tx = await coreLending.borrow(amountWei, collateralWei, duration);
      return await tx.wait();
    } catch (error) {
      console.error('借款失败:', error);
      throw error;
    }
  }, [coreLending, tokenA, tokenB, address]);

  // 还款
  const repay = useCallback(async (loanId: number) => {
    if (!coreLending || !tokenA || !address) {
      throw new Error('合约未初始化或钱包未连接');
    }

    try {
      // 获取贷款信息
      const loan = await lendingPool.getLoan(address, loanId);
      const repayAmount = loan.amount * (100 + interestRate) / 100;
      
      // 检查并授权 tokenA (借款资产)
      const allowance = await tokenA.allowance(address, coreLending.target);
      if (allowance < repayAmount) {
        const approveTx = await tokenA.approve(coreLending.target, repayAmount);
        await approveTx.wait();
      }
      
      // 执行还款
      const tx = await coreLending.repay(loanId);
      return await tx.wait();
    } catch (error) {
      console.error('还款失败:', error);
      throw error;
    }
  }, [coreLending, lendingPool, tokenA, address, interestRate]);

  // 初始化
  useEffect(() => {
    if (isConnected && lendingPool) {
      fetchLoans();
      fetchInterestRate();
    }
  }, [isConnected, lendingPool, fetchLoans, fetchInterestRate]);

  return {
    loans,
    loading,
    interestRate,
    borrow,
    repay,
    fetchLoans,
  };
};

// 代币相关 Hook
export const useTokens = () => {
  const { tokenA, tokenB } = useContracts();
  const { address, isConnected } = useAccount();
  const [balances, setBalances] = useState({
    tokenA: '0',
    tokenB: '0',
  });
  const [loading, setLoading] = useState(false);

  // 获取代币余额
  const fetchBalances = useCallback(async () => {
    if (!tokenA || !tokenB || !address) return;
    
    try {
      setLoading(true);
      const [balanceA, balanceB] = await Promise.all([
        tokenA.balanceOf(address),
        tokenB.balanceOf(address),
      ]);
      
      setBalances({
        tokenA: ethers.formatUnits(balanceA, 6), // USDC 是 6 位小数
        tokenB: ethers.formatUnits(balanceB, 18), // ETH 是 18 位小数
      });
    } catch (error) {
      console.error('获取余额失败:', error);
    } finally {
      setLoading(false);
    }
  }, [tokenA, tokenB, address]);

  // 初始化
  useEffect(() => {
    if (isConnected && tokenA && tokenB) {
      fetchBalances();
    }
  }, [isConnected, tokenA, tokenB, fetchBalances]);

  return {
    balances,
    loading,
    fetchBalances,
  };
};

// 黑名单相关 Hook
export const useBlacklist = () => {
  const { blackList } = useContracts();
  const { address } = useAccount();
  const [isBlacklisted, setIsBlacklisted] = useState(false);
  const [loading, setLoading] = useState(false);

  // 检查是否在黑名单中
  const checkBlacklist = useCallback(async () => {
    if (!blackList || !address) return;
    
    try {
      setLoading(true);
      const result = await blackList.isBlacklisted(address);
      setIsBlacklisted(result);
    } catch (error) {
      console.error('检查黑名单失败:', error);
    } finally {
      setLoading(false);
    }
  }, [blackList, address]);

  // 初始化
  useEffect(() => {
    if (blackList && address) {
      checkBlacklist();
    }
  }, [blackList, address, checkBlacklist]);

  return {
    isBlacklisted,
    loading,
    checkBlacklist,
  };
};
