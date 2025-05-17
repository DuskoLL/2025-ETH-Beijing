import { ethers } from 'ethers';
import walletService from './walletService';
import { store } from '../store';

// 由于循环依赖问题，先定义action类型
const setRiskPoolLoading = (loading: boolean) => ({
  type: 'riskPool/setRiskPoolLoading',
  payload: loading
});

const updateRiskPoolInfo = (info: any) => ({
  type: 'riskPool/updateRiskPoolInfo',
  payload: info
});

export class RiskPoolService {
  private poolContract: ethers.Contract | null = null;
  private contractAddress = '0x123456789abcdef123456789abcdef123456789a'; // 风险池合约地址
  
  // 初始化合约
  async initContract() {
    try {
      const signer = walletService.getSigner();
      if (!signer) throw new Error('未连接钱包');
      
      const abi = [
        "function getPoolBalance() view returns (uint256)",
        "function distributeInterest(uint256 amount) returns (uint256, uint256)",
        "function addPenaltyToPool(uint256 amount) returns (bool)",
        "function compensateLender(address lender, uint256 amount) returns (bool)"
      ];
      
      this.poolContract = new ethers.Contract(this.contractAddress, abi, signer);
      return true;
    } catch (error) {
      console.error('初始化风险池合约失败:', error);
      return false;
    }
  }
  
  // 获取风险池总额
  async getPoolBalance() {
    try {
      store.dispatch(setRiskPoolLoading(true));
      
      if (!this.poolContract) await this.initContract();
      if (!this.poolContract) throw new Error('合约未初始化');
      
      const balance = await this.poolContract.getPoolBalance();
      
      store.dispatch(updateRiskPoolInfo({
        totalBalance: ethers.formatEther(balance)
      }));
      
      store.dispatch(setRiskPoolLoading(false));
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('获取风险池余额失败:', error);
      store.dispatch(setRiskPoolLoading(false));
      throw error;
    }
  }
  
  // 计算利息分配
  calculateInterestDistribution(interestAmount: string) {
    const amount = ethers.parseEther(interestAmount);
    const toRiskPool = amount * 20n / 100n; // 20%进入风险池
    const toLender = amount - toRiskPool; // 80%给贷款人
    
    return {
      riskPoolAmount: ethers.formatEther(toRiskPool),
      lenderAmount: ethers.formatEther(toLender)
    };
  }
  
  // 将罚金添加到风险池
  async addPenaltyToPool(amount: string) {
    try {
      if (!this.poolContract) await this.initContract();
      if (!this.poolContract) throw new Error('合约未初始化');
      
      const tx = await this.poolContract.addPenaltyToPool(ethers.parseEther(amount));
      await tx.wait();
      
      // 更新风险池信息
      await this.getPoolBalance();
      
      return true;
    } catch (error) {
      console.error('添加罚金到风险池失败:', error);
      throw error;
    }
  }
  
  // 从风险池中补偿贷款人
  async compensateLender(lender: string, amount: string) {
    try {
      if (!this.poolContract) await this.initContract();
      if (!this.poolContract) throw new Error('合约未初始化');
      
      const tx = await this.poolContract.compensateLender(lender, ethers.parseEther(amount));
      await tx.wait();
      
      // 更新风险池信息
      await this.getPoolBalance();
      
      return true;
    } catch (error) {
      console.error('补偿贷款人失败:', error);
      throw error;
    }
  }
}

const riskPoolService = new RiskPoolService();
export default riskPoolService;
