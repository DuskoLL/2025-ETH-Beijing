import { ethers } from 'ethers';
import walletService from './walletService';
import { store } from '../store';

// 由于循环依赖问题，先定义action类型
const setStakingLoading = (loading: boolean) => ({
  type: 'staking/setStakingLoading',
  payload: loading
});

const updateStakingInfo = (info: any) => ({
  type: 'staking/updateStakingInfo',
  payload: info
});

export class StakingService {
  private stakingContract: ethers.Contract | null = null;
  private contractAddress = '0xabcdef123456789abcdef123456789abcdef1234'; // 质押合约地址
  
  // 初始化合约
  async initContract() {
    try {
      const signer = walletService.getSigner();
      if (!signer) throw new Error('未连接钱包');
      
      const abi = [
        "function getStakedAmount(address staker) view returns (uint256)",
        "function getRewards(address staker) view returns (uint256)",
        "function getPenalties(address staker) view returns (uint256)",
        "function stake(uint256 amount) returns (bool)",
        "function unstake(uint256 amount) returns (bool)",
        "function claimRewards() returns (uint256)"
      ];
      
      this.stakingContract = new ethers.Contract(this.contractAddress, abi, signer);
      return true;
    } catch (error) {
      console.error('初始化质押合约失败:', error);
      return false;
    }
  }
  
  // 获取质押信息
  async getStakingInfo(address: string) {
    try {
      store.dispatch(setStakingLoading(true));
      
      if (!this.stakingContract) await this.initContract();
      if (!this.stakingContract) throw new Error('合约未初始化');
      
      const stakedAmount = await this.stakingContract.getStakedAmount(address);
      const rewards = await this.stakingContract.getRewards(address);
      const penalties = await this.stakingContract.getPenalties(address);
      
      store.dispatch(updateStakingInfo({
        stakedAmount: ethers.formatEther(stakedAmount),
        rewards: ethers.formatEther(rewards),
        penalties: ethers.formatEther(penalties)
      }));
      
      store.dispatch(setStakingLoading(false));
      return {
        stakedAmount: ethers.formatEther(stakedAmount),
        rewards: ethers.formatEther(rewards),
        penalties: ethers.formatEther(penalties)
      };
    } catch (error) {
      console.error('获取质押信息失败:', error);
      store.dispatch(setStakingLoading(false));
      throw error;
    }
  }
  
  // 质押代币
  async stakeTokens(amount: string) {
    try {
      if (!this.stakingContract) await this.initContract();
      if (!this.stakingContract) throw new Error('合约未初始化');
      
      const tx = await this.stakingContract.stake(ethers.parseEther(amount));
      await tx.wait();
      
      // 更新质押信息
      const address = await walletService.getSigner()?.getAddress();
      if (address) {
        await this.getStakingInfo(address);
      }
      
      return true;
    } catch (error) {
      console.error('质押代币失败:', error);
      throw error;
    }
  }
  
  // 取回质押
  async unstakeTokens(amount: string) {
    try {
      if (!this.stakingContract) await this.initContract();
      if (!this.stakingContract) throw new Error('合约未初始化');
      
      const tx = await this.stakingContract.unstake(ethers.parseEther(amount));
      await tx.wait();
      
      // 更新质押信息
      const address = await walletService.getSigner()?.getAddress();
      if (address) {
        await this.getStakingInfo(address);
      }
      
      return true;
    } catch (error) {
      console.error('取回质押失败:', error);
      throw error;
    }
  }
  
  // 领取奖励
  async claimRewards() {
    try {
      if (!this.stakingContract) await this.initContract();
      if (!this.stakingContract) throw new Error('合约未初始化');
      
      const tx = await this.stakingContract.claimRewards();
      const receipt = await tx.wait();
      
      // 更新质押信息
      const address = await walletService.getSigner()?.getAddress();
      if (address) {
        await this.getStakingInfo(address);
      }
      
      // 从事件中获取领取的奖励金额
      const claimedAmount = '0'; // 实际应从事件中解析
      
      return claimedAmount;
    } catch (error) {
      console.error('领取奖励失败:', error);
      throw error;
    }
  }
  
  // 计算质押惩罚
  async calculatePenalty(loanAmount: string) {
    try {
      const address = await walletService.getSigner()?.getAddress();
      if (!address) throw new Error('未连接钱包');
      
      const stakingInfo = await this.getStakingInfo(address);
      const stakedAmount = ethers.parseEther(stakingInfo.stakedAmount);
      const loanAmountWei = ethers.parseEther(loanAmount);
      
      // 惩罚计算逻辑：违约贷款金额的10%
      const penaltyAmount = loanAmountWei * 10n / 100n;
      
      // 如果质押金额不足以支付惩罚，则全部扣除
      const actualPenalty = penaltyAmount > stakedAmount ? stakedAmount : penaltyAmount;
      
      return ethers.formatEther(actualPenalty);
    } catch (error) {
      console.error('计算质押惩罚失败:', error);
      throw error;
    }
  }
}

const stakingService = new StakingService();
export default stakingService;
