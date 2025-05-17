import React, { useState } from 'react';
import { 
  Button, 
  Typography, 
  Box, 
  Menu, 
  MenuItem, 
  Divider,
  Tooltip,
  CircularProgress
} from '@mui/material';
import { 
  AccountBalanceWallet as WalletIcon,
  ContentCopy as CopyIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import walletService from '../services/walletService';

const WalletButton: React.FC = () => {
  const { address, isConnected, balance, chainId } = useSelector((state: RootState) => state.wallet);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  
  const open = Boolean(anchorEl);
  
  // 处理连接钱包
  const handleConnectWallet = async () => {
    setLoading(true);
    try {
      await walletService.connectWallet();
    } catch (error) {
      console.error('连接钱包失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 处理断开连接
  const handleDisconnect = () => {
    walletService.disconnectWallet();
    handleClose();
  };
  
  // 打开菜单
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  // 关闭菜单
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  // 复制地址
  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };
  
  // 格式化地址显示
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  // 获取链名称
  const getChainName = (chainId: string) => {
    const chains: Record<string, string> = {
      '1': 'Ethereum Mainnet',
      '5': 'Goerli Testnet',
      '11155111': 'Sepolia Testnet',
      '137': 'Polygon Mainnet',
      '80001': 'Mumbai Testnet',
      '56': 'BNB Smart Chain',
      '97': 'BSC Testnet',
      '42161': 'Arbitrum One',
      '421613': 'Arbitrum Goerli',
      '10': 'Optimism',
      '420': 'Optimism Goerli',
      '43114': 'Avalanche C-Chain',
      '43113': 'Avalanche Fuji'
    };
    
    return chains[chainId] || `Chain ID: ${chainId}`;
  };
  
  // 刷新余额
  const refreshBalance = async () => {
    await walletService.refreshBalance();
  };
  
  if (!isConnected) {
    return (
      <Button
        variant="contained"
        color="primary"
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <WalletIcon />}
        onClick={handleConnectWallet}
        disabled={loading}
      >
        {loading ? '连接中...' : '连接钱包'}
      </Button>
    );
  }
  
  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleClick}
        startIcon={<WalletIcon />}
      >
        {address ? formatAddress(address) : '已连接'}
      </Button>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'wallet-button',
        }}
      >
        <Box sx={{ p: 2, width: 280 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            钱包信息
          </Typography>
          
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              地址
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
              <Typography variant="body2" sx={{ mr: 1 }}>
                {formatAddress(address || '')}
              </Typography>
              <Tooltip title={copySuccess ? "已复制!" : "复制地址"}>
                <CopyIcon 
                  fontSize="small" 
                  sx={{ cursor: 'pointer', color: copySuccess ? 'success.main' : 'inherit' }} 
                  onClick={copyAddress}
                />
              </Tooltip>
            </Box>
          </Box>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              稳定币余额
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
              <Typography variant="body2">
                {(parseFloat(balance) * 1800).toFixed(2)} USDC
              </Typography>
              <Button size="small" onClick={refreshBalance}>
                刷新
              </Button>
            </Box>
          </Box>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              网络
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {chainId ? getChainName(chainId) : '未知网络'}
            </Typography>
          </Box>
        </Box>
        
        <Divider />
        
        <MenuItem onClick={handleDisconnect}>
          <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
          断开连接
        </MenuItem>
      </Menu>
    </>
  );
};

export default WalletButton;
