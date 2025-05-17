import React, { createContext, useContext, ReactNode, useState } from 'react';
import { ethers } from 'ethers';
import CoreLendingABI from './abi/CoreLending.json';

// 智能合约地址 - 需要替换为实际部署的合约地址
const CORE_LENDING_ADDRESS = '0x123456789abcdef123456789abcdef123456789a';
const LENDING_POOL_ADDRESS = '0xabcdef123456789abcdef123456789abcdef1234';

// 获取 Etherscan 链接
const getEtherscanLink = (hash: string) => {
  return `https://sepolia.etherscan.io/tx/${hash}`;
};

// 创建合约上下文
interface ContractContextType {
  // 账户状态
  address?: string;
  isConnected: boolean;
  
  // 合约交互函数
  borrowWithoutCollateral: (amount: string, duration: number) => Promise<{ hash: string }>;
  borrow: (amount: string, collateralAmount: string, duration: number) => Promise<{ hash: string }>;
  repay: (loanId: number) => Promise<{ hash: string }>;
  txStatus: 'idle' | 'pending' | 'success' | 'error';
  txHash: string | null;
}

const ContractContext = createContext<ContractContextType | undefined>(undefined);

// 合约提供者组件
export function ContractProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [isConnected, setIsConnected] = useState(false);
  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  
  // 连接钱包
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // 请求账户访问
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAddress(accounts[0]);
        setIsConnected(true);
        return accounts[0];
      } catch (error) {
        console.error('连接钱包失败:', error);
        throw error;
      }
    } else {
      throw new Error('请安装 MetaMask!');
    }
  };
  
  // 创建合约实例
  const getContract = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      return new ethers.Contract(CORE_LENDING_ADDRESS, CoreLendingABI, signer);
    } else {
      throw new Error('请安装 MetaMask!');
    }
  };
  
  // 无抵押借款
  const borrowWithoutCollateral = async (amount: string, duration: number) => {
    if (!isConnected) {
      await connectWallet();
    }
    
    try {
      setTxStatus('pending');
      const contract = await getContract();
      const amountInWei = ethers.parseEther(amount);
      
      const tx = await contract.borrowWithoutCollateral(amountInWei, duration);
      setTxHash(tx.hash);
      
      // 等待交易确认
      await tx.wait();
      setTxStatus('success');
      
      return { hash: tx.hash, etherscanLink: getEtherscanLink(tx.hash) };
    } catch (error) {
      console.error('无抵押借款失败:', error);
      setTxStatus('error');
      throw error;
    }
  };
  
  // 有抵押借款
  const borrow = async (amount: string, collateralAmount: string, duration: number) => {
    if (!isConnected) {
      await connectWallet();
    }
    
    try {
      setTxStatus('pending');
      const contract = await getContract();
      const amountInWei = ethers.parseEther(amount);
      const collateralInWei = ethers.parseEther(collateralAmount);
      
      const tx = await contract.borrow(amountInWei, collateralInWei, duration);
      setTxHash(tx.hash);
      
      // 等待交易确认
      await tx.wait();
      setTxStatus('success');
      
      return { hash: tx.hash, etherscanLink: getEtherscanLink(tx.hash) };
    } catch (error) {
      console.error('借款失败:', error);
      setTxStatus('error');
      throw error;
    }
  };
  
  // 还款
  const repay = async (loanId: number) => {
    if (!isConnected) {
      await connectWallet();
    }
    
    try {
      setTxStatus('pending');
      const contract = await getContract();
      
      const tx = await contract.repay(loanId);
      setTxHash(tx.hash);
      
      // 等待交易确认
      await tx.wait();
      setTxStatus('success');
      
      return { hash: tx.hash, etherscanLink: getEtherscanLink(tx.hash) };
    } catch (error) {
      console.error('还款失败:', error);
      setTxStatus('error');
      throw error;
    }
  };
  
  const value = {
    address,
    isConnected,
    txStatus,
    txHash,
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
