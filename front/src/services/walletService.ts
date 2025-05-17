import { ethers } from 'ethers';
import { store } from '../store';
import { setWallet, disconnectWallet, updateBalance } from '../store/walletSlice';

export class WalletService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;

  // 检查是否已安装MetaMask
  public isMetaMaskInstalled(): boolean {
    return window.ethereum !== undefined;
  }

  // 连接钱包
  public async connectWallet(): Promise<boolean> {
    try {
      if (!this.isMetaMaskInstalled()) {
        alert('请安装MetaMask钱包插件');
        window.open('https://metamask.io/download/', '_blank');
        return false;
      }

      // 创建provider
      this.provider = new ethers.BrowserProvider(window.ethereum);
      
      // 请求用户连接
      const accounts = await this.provider.send("eth_requestAccounts", []);
      
      if (accounts.length === 0) {
        return false;
      }

      // 获取signer
      this.signer = await this.provider.getSigner();
      const address = await this.signer.getAddress();
      
      // 获取余额
      const balance = await this.provider.getBalance(address);
      const formattedBalance = ethers.formatEther(balance);
      
      // 获取chainId
      const network = await this.provider.getNetwork();
      const chainId = network.chainId.toString();

      // 更新Redux状态
      store.dispatch(setWallet({
        address,
        balance: formattedBalance,
        chainId,
      }));

      // 监听账户变化
      window.ethereum.on('accountsChanged', this.handleAccountsChanged);
      
      // 监听链变化
      window.ethereum.on('chainChanged', this.handleChainChanged);

      return true;
    } catch (error) {
      console.error('连接钱包失败:', error);
      return false;
    }
  }

  // 断开钱包连接
  public disconnectWallet(): void {
    // 移除事件监听器
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', this.handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', this.handleChainChanged);
    }
    
    this.provider = null;
    this.signer = null;
    
    // 更新Redux状态
    store.dispatch(disconnectWallet());
  }

  // 处理账户变化
  private handleAccountsChanged = async (accounts: string[]): Promise<void> => {
    if (accounts.length === 0) {
      // 用户断开了连接
      this.disconnectWallet();
    } else {
      // 账户切换
      if (this.provider) {
        const newAddress = accounts[0];
        const balance = await this.provider.getBalance(newAddress);
        const formattedBalance = ethers.formatEther(balance);
        
        const network = await this.provider.getNetwork();
        const chainId = network.chainId.toString();

        store.dispatch(setWallet({
          address: newAddress,
          balance: formattedBalance,
          chainId,
        }));
      }
    }
  };

  // 处理链变化
  private handleChainChanged = (): void => {
    // 当链变化时，最简单的方法是刷新页面
    window.location.reload();
  };

  // 获取当前余额
  public async refreshBalance(): Promise<void> {
    try {
      const state = store.getState();
      const { address } = state.wallet;
      
      if (address && this.provider) {
        const balance = await this.provider.getBalance(address);
        const formattedBalance = ethers.formatEther(balance);
        store.dispatch(updateBalance(formattedBalance));
      }
    } catch (error) {
      console.error('获取余额失败:', error);
    }
  }
}

// 创建单例实例
const walletService = new WalletService();
export default walletService;

// 为TypeScript添加window.ethereum类型
declare global {
  interface Window {
    ethereum?: any;
  }
}
