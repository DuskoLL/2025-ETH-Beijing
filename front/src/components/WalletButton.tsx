import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Typography, 
  Box, 
  Menu, 
  MenuItem, 
  Divider,
  Tooltip,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
  alpha,
  Avatar
} from '@mui/material';
import { 
  AccountBalanceWallet as WalletIcon,
  ContentCopy as CopyIcon,
  Logout as LogoutIcon,
  Refresh as RefreshIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import walletService from '../services/walletService';

interface TokenBalance {
  symbol: string;
  balance: string;
}

const WalletButton: React.FC = () => {
  const { address, isConnected, balance, chainId, tokenBalances, isLoadingTokens } = useSelector((state: RootState) => state.wallet);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const formattedBalance = balance ? Number(balance).toFixed(4) : '0.0000';
  
  // 组件加载时获取代币余额
  useEffect(() => {
    if (isConnected && address) {
      walletService.fetchTokenBalances();
    }
  }, [isConnected, address]);
  
  const open = Boolean(anchorEl);
  
  // 处理连接钱包
  const handleConnectWallet = async () => {
    setLoading(true);
    try {
      console.log('开始连接钱包...');
      const success = await walletService.connectWallet();
      console.log('钱包连接结果:', success ? '成功' : '失败');
      
      if (!success) {
        // 检查是否安装了MetaMask
        if (!walletService.isMetaMaskInstalled()) {
          alert('请安装MetaMask钱包插件，然后刷新页面');
          window.open('https://metamask.io/download/', '_blank');
        } else {
          // MetaMask已安装但连接失败
          alert('连接钱包失败，请确保MetaMask已解锁，并授权连接');
        }
      }
    } catch (error) {
      console.error('连接钱包失败:', error);
      alert(`连接钱包出错: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  // 处理断开连接
  const handleDisconnect = () => {
    walletService.disconnectWallet();
    handleClose();
  };

  const handleRefresh = async () => {
    setIsLoadingBalance(true);
    try {
      await walletService.refreshBalance();
    } catch (error) {
      console.error('刷新余额失败:', error);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleOpenExplorer = () => {
    if (!address || !chainId) return;
    
    // 根据chainId获取区块浏览器URL
    let explorerUrl = 'https://etherscan.io';
    
    const chainIdStr = String(chainId);
    
    if (chainIdStr === '11155111') { // Sepolia测试网
      explorerUrl = 'https://sepolia.etherscan.io';
    } else if (chainIdStr === '5') { // Goerli测试网
      explorerUrl = 'https://goerli.etherscan.io';
    }
      
    window.open(`${explorerUrl}/address/${address}`, '_blank');
  };

  // 格式化地址显示
  const formatAddress = (addr: string) => `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  // 获取链名称
  const getChainName = (id: number | string | undefined): string => {
    if (!id) return 'Unknown Network';
    
    const chainId = typeof id === 'string' ? parseInt(id, 10) : id;
    
    switch (chainId) {
      case 1: return 'Ethereum Mainnet';
      case 5: return 'Goerli Testnet';
      case 11155111: return 'Sepolia Testnet';
      default: return `Chain ID: ${chainId}`;
    }
  };

  // 如果未连接钱包，显示连接按钮
  if (!isConnected) {
    return (
      <Button
        variant="contained"
        color="primary"
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <WalletIcon />}
        onClick={handleConnectWallet}
        disabled={loading}
        sx={{
          borderRadius: '20px',
          textTransform: 'none',
          fontWeight: 'bold',
          background: 'linear-gradient(90deg, #3a7bd5, #00d2ff)',
          '&:hover': {
            background: 'linear-gradient(90deg, #2b68c0, #00b3db)',
          }
        }}
      >
        {loading ? '连接中...' : '连接钱包'}
      </Button>
    );
  }

  return (
    <React.Fragment>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleClick}
        startIcon={<WalletIcon />}
        sx={{
          borderRadius: '20px',
          textTransform: 'none',
          fontWeight: 'bold',
          background: 'linear-gradient(90deg, #3a7bd5, #00d2ff)',
          '&:hover': {
            background: 'linear-gradient(90deg, #2b68c0, #00b3db)',
          }
        }}
      >
        {address ? formatAddress(address) : '已连接'}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            width: '280px',
            padding: '8px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Avatar 
            sx={{ 
              width: 64, 
              height: 64, 
              margin: '0 auto 16px',
              background: 'linear-gradient(45deg, #3a7bd5, #00d2ff)'
            }}
          >
            {address ? address.substring(2, 4).toUpperCase() : 'W'}
          </Avatar>
          
          <Typography variant="subtitle1" fontWeight="bold">
            {address && formatAddress(address)}
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            {getChainName(chainId)}
          </Typography>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
            <Tooltip title="复制地址">
              <Button
                size="small"
                variant="outlined"
                startIcon={<CopyIcon />}
                onClick={copyAddress}
                color={copySuccess ? "success" : "primary"}
              >
                {copySuccess ? '已复制' : '复制'}
              </Button>
            </Tooltip>

            <Tooltip title="在区块浏览器中查看">
              <Button
                size="small"
                variant="outlined"
                startIcon={<ArrowForwardIcon />}
                onClick={handleOpenExplorer}
              >
                浏览器
              </Button>
            </Tooltip>
          </Box>

          <Box sx={{ mt: 3, textAlign: 'left' }}>
            <Typography variant="body2" color="text.secondary">
              链名称
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {chainId ? getChainName(chainId) : '未知网络'}
            </Typography>
          </Box>

          <Box sx={{ mt: 2, textAlign: 'left' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                ETH 余额
              </Typography>
              <Tooltip title="刷新余额">
                <RefreshIcon
                  fontSize="small"
                  onClick={handleRefresh}
                  sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                />
              </Tooltip>
            </Box>
            <Typography variant="body1" fontWeight="bold">
              {isLoadingBalance ? <CircularProgress size={16} /> : formattedBalance} ETH
            </Typography>
          </Box>

          {tokenBalances && tokenBalances.length > 0 && (
            <Box sx={{ mt: 2, textAlign: 'left' }}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                代币余额
              </Typography>
              <List dense sx={{ bgcolor: alpha('#f5f5f5', 0.5), borderRadius: 1, maxHeight: 120, overflow: 'auto' }}>
                {tokenBalances.map((token: TokenBalance, index: number) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={token.symbol}
                      secondary={`${token.balance} ${token.symbol}`}
                      primaryTypographyProps={{ fontWeight: 'bold' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>

        <Divider />

        <MenuItem onClick={handleDisconnect}>
          <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
          断开连接
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default WalletButton;
