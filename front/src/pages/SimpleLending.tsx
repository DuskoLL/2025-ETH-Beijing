import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  useTheme,
  alpha,
} from '@mui/material';
import { useWallet } from '../hooks/useWallet';
import TeamLogo from '../components/icons/TeamLogo';

const SimpleLending: React.FC = () => {
  const theme = useTheme();
  const { address, isConnected, connectWallet, disconnectWallet } = useWallet();

  return (
    <Box sx={{ minHeight: '100vh', py: 4, bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            fontWeight="700" 
            sx={{ 
              mb: 2,
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            去中心化借贷平台
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            连接您的钱包，体验真实的区块链借贷服务
          </Typography>
        </Box>

        <Card sx={{ 
          borderRadius: 3, 
          boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.1)}`,
          overflow: 'hidden',
          backdropFilter: 'blur(6px)',
          background: alpha(theme.palette.background.paper, 0.9),
        }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              {isConnected ? (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    钱包已连接
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    地址: {address && `${address.substring(0, 6)}...${address.substring(address.length - 4)}`}
                  </Typography>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    onClick={disconnectWallet}
                    startIcon={<TeamLogo />}
                  >
                    断开连接
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    请连接您的钱包
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    连接MetaMask钱包以访问完整功能
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={connectWallet}
                    startIcon={<TeamLogo />}
                    sx={{ px: 3, py: 1 }}
                  >
                    连接钱包
                  </Button>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default SimpleLending;
