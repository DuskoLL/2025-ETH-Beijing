import React from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { Button, Box, Typography, Avatar, Menu, MenuItem, Divider, Tooltip } from '@mui/material';
import { WalletOptions } from './WalletOptions';
import { useWalletInfo } from '../hooks/useWalletInfo';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LogoutIcon from '@mui/icons-material/Logout';

export function WalletConnectButton() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { chainInfo, formattedBalance, tokenBalances } = useWalletInfo();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      // 可以添加一个提示，表示地址已复制
    }
    handleClose();
  };
  
  const handleOpenExplorer = () => {
    if (address && chainInfo) {
      window.open(`${chainInfo.blockExplorer}/address/${address}`, '_blank');
    }
    handleClose();
  };
  
  const handleDisconnect = () => {
    disconnect();
    handleClose();
  };
  
  // 格式化地址显示
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  if (!isConnected) {
    return <WalletOptions buttonStyle="navbar" />;
  }
  
  return (
    <Box>
      <Button
        variant="contained"
        onClick={handleClick}
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
        {address && formatAddress(address)}
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
            {chainInfo?.name || '未知网络'}
          </Typography>
          
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              {formattedBalance} {chainInfo?.nativeCurrency.symbol || 'ETH'}
            </Typography>
          </Box>
          
          {/* 显示稳定币余额 */}
          {tokenBalances.length > 0 && (
            <Box sx={{ mt: 1, mb: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                稳定币余额
              </Typography>
              {tokenBalances.map((token) => (
                <Box key={token.address} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">{token.symbol}</Typography>
                  <Typography variant="body2" fontWeight="medium">{token.formattedBalance}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
        
        <Divider />
        
        <MenuItem onClick={handleCopyAddress} sx={{ borderRadius: '8px', mt: 1 }}>
          <ContentCopyIcon fontSize="small" sx={{ mr: 1 }} />
          <Typography>复制地址</Typography>
        </MenuItem>
        
        <MenuItem onClick={handleOpenExplorer} sx={{ borderRadius: '8px' }}>
          <OpenInNewIcon fontSize="small" sx={{ mr: 1 }} />
          <Typography>在区块浏览器中查看</Typography>
        </MenuItem>
        
        <MenuItem onClick={handleDisconnect} sx={{ borderRadius: '8px', color: 'error.main' }}>
          <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
          <Typography>断开连接</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}
