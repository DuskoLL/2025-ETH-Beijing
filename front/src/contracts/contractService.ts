import { ethers } from 'ethers'
import CoreLendingABI from './abi/CoreLending.json'

// 智能合约地址 - 需要替换为实际部署的合约地址
const CORE_LENDING_ADDRESS = '0x123456789abcdef123456789abcdef123456789a' // 替换为实际部署的合约地址

// 获取 Etherscan 链接
const getEtherscanLink = (hash: string) => {
  return `https://sepolia.etherscan.io/tx/${hash}`;
};

// 合约交互服务
const contractService = {
  // 创建合约实例
  async getContract() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      return new ethers.Contract(CORE_LENDING_ADDRESS, CoreLendingABI, signer);
    } else {
      throw new Error('请安装 MetaMask!');
    }
  },
  
  // 获取钱包地址
  async getAddress() {
    if (typeof window.ethereum !== 'undefined') {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        return accounts[0];
      }
      throw new Error('钱包未连接');
    } else {
      throw new Error('请安装 MetaMask!');
    }
  },

  // 无抵押借款
  async borrowWithoutCollateral(amount: string, duration: number) {
    try {
      const contract = await this.getContract();
      const amountInWei = ethers.parseEther(amount);
      
      // 发送交易
      const tx = await contract.borrowWithoutCollateral(amountInWei, duration);
      
      // 等待交易确认
      await tx.wait();
      
      return { hash: tx.hash, etherscanLink: getEtherscanLink(tx.hash) };
    } catch (error) {
      console.error('无抵押借款失败:', error);
      throw error;
    }
  },

  // 有抵押借款
  async borrow(amount: string, collateralAmount: string, duration: number) {
    try {
      const contract = await this.getContract();
      const amountInWei = ethers.parseEther(amount);
      const collateralInWei = ethers.parseEther(collateralAmount);
      
      // 发送交易
      const tx = await contract.borrow(amountInWei, collateralInWei, duration);
      
      // 等待交易确认
      await tx.wait();
      
      return { hash: tx.hash, etherscanLink: getEtherscanLink(tx.hash) };
    } catch (error) {
      console.error('借款失败:', error);
      throw error;
    }
  },
  
  // 还款
  async repay(loanId: number) {
    try {
      const contract = await this.getContract();
      
      // 发送交易
      const tx = await contract.repay(loanId);
      
      // 等待交易确认
      await tx.wait();
      
      return { hash: tx.hash, etherscanLink: getEtherscanLink(tx.hash) };
    } catch (error) {
      console.error('还款失败:', error);
      throw error;
    }
  }
};

export default contractService;
