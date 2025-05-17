import React, { createContext, useContext, ReactNode } from 'react';
import { useAccount, useWriteContract, useChainId } from 'wagmi';
import { parseEther } from 'viem';
import { sepolia } from 'wagmi/chains';
import CoreLendingABI from './abi/CoreLending.json';

// 智能合约地址 - 需要替换为实际部署的合约地址
const CORE_LENDING_ADDRESS = '0x123456789abcdef123456789abcdef123456789a';

// 创建合约上下文
interface ContractContextType {
  // 账户状态
  address?: string;
  isConnected: boolean;
  
  // 合约交互函数
  borrowWithoutCollateral: (amount: string, duration: number) => Promise<{ hash: string }>;
  borrow: (amount: string, collateralAmount: string, duration: number) => Promise<{ hash: string }>;
  repay: (loanId: number) => Promise<{ hash: string }>;
}

const ContractContext = createContext<ContractContextType | undefined>(undefined);

// 合约提供者组件
export function ContractProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  
  // 无抵押借款
  const borrowWithoutCollateral = async (amount: string, duration: number) => {
    if (!isConnected || !address) {
      throw new Error('钱包未连接');
    }
    
    try {
      const amountInWei = parseEther(amount);
      
      const hash = await writeContractAsync({
        address: CORE_LENDING_ADDRESS as `0x${string}`,
        abi: CoreLendingABI,
        functionName: 'borrowWithoutCollateral',
        args: [amountInWei, BigInt(duration)],
        account: address,
        chain: sepolia,
      });
      
      return { hash };
    } catch (error) {
      console.error('无抵押借款失败:', error);
      throw error;
    }
  };
  
  // 有抵押借款
  const borrow = async (amount: string, collateralAmount: string, duration: number) => {
    if (!isConnected || !address) {
      throw new Error('钱包未连接');
    }
    
    try {
      const amountInWei = parseEther(amount);
      const collateralInWei = parseEther(collateralAmount);
      
      const hash = await writeContractAsync({
        address: CORE_LENDING_ADDRESS as `0x${string}`,
        abi: CoreLendingABI,
        functionName: 'borrow',
        args: [amountInWei, collateralInWei, BigInt(duration)],
        account: address,
        chain: sepolia,
      });
      
      return { hash };
    } catch (error) {
      console.error('借款失败:', error);
      throw error;
    }
  };
  
  // 还款
  const repay = async (loanId: number) => {
    if (!isConnected || !address) {
      throw new Error('钱包未连接');
    }
    
    try {
      const hash = await writeContractAsync({
        address: CORE_LENDING_ADDRESS as `0x${string}`,
        abi: CoreLendingABI,
        functionName: 'repay',
        args: [BigInt(loanId)],
        account: address,
        chain: sepolia,
      });
      
      return { hash };
    } catch (error) {
      console.error('还款失败:', error);
      throw error;
    }
  };
  
  const value = {
    address,
    isConnected,
    borrowWithoutCollateral,
    borrow,
    repay,
  };
  
  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
}

// 使用合约的钩子
export function useContract() {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error('useContract must be used within a ContractProvider');
  }
  return context;
}
