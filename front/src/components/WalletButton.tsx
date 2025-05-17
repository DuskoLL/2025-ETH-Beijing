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
  alpha
} from '@mui/material';
import { 
  AccountBalanceWallet as WalletIcon,
  ContentCopy as CopyIcon,
  Logout as LogoutIcon,
  Refresh as RefreshIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import walletService from '../services/walletService';

const WalletButton: React.FC = () => {
  const { address, isConnected, balance, chainId, tokenBalances, isLoadingTokens } = useSelector((state: RootState) => state.wallet);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  
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
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                代币余额
              </Typography>
              <Button 
                size="small" 
                startIcon={<RefreshIcon fontSize="small" />}
                onClick={refreshBalance}
                disabled={isLoadingTokens}
              >
                {isLoadingTokens ? '加载中...' : '刷新'}
              </Button>
            </Box>
            
            {isLoadingTokens ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : tokenBalances && tokenBalances.length > 0 ? (
              <List dense sx={{ mt: 1, p: 0 }}>
                {/* 显示真实的代币余额 */}
                {tokenBalances.map((token) => (
                  <ListItem key={token.symbol} sx={{ px: 0, py: 0.5 }}>
                    <ListItemText 
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Chip 
                            label={token.symbol} 
                            size="small" 
                            sx={{ 
                              mr: 1, 
                              fontSize: '0.7rem',
                              height: 20,
                              bgcolor: alpha('#1976d2', 0.1),
                              color: '#1976d2',
                              '& .MuiChip-label': { px: 1 }
                            }} 
                          />
                          <Typography variant="body2">{token.name}</Typography>
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                          {parseFloat(token.formattedBalance).toFixed(6)} {token.symbol}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ mt: 1, p: 1, bgcolor: alpha('#f5f5f5', 0.5), borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" align="center">
                  没有发现代币余额
                </Typography>
              </Box>
            )}
            
            <Box sx={{ mt: 1, p: 1, bgcolor: alpha('#f5f5f5', 0.5), borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                ETH余额: {parseFloat(balance).toFixed(6)} ETH
              </Typography>
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
