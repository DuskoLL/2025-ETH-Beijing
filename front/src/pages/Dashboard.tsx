import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Alert,
  Stack,
  Grid,
  Paper,
  Divider,
  Chip,
  Fade,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  Avatar,
  LinearProgress,
  keyframes,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useWallet } from '../hooks/useWallet';
import {
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { TeamLogo } from '../components/TeamIcons';
import TeamIconImage from '../components/TeamIconImage';
import {
  TechCard,
  DataCard,
  TechPanel,
  GlowingBorder,
  TechButtonContainer,
  DataGrid,
  TechBackground,
  PulseContainer,
  ScanEffect,
  NeonText,
  DataIndicator
} from '../components/TechStyles';

// 动画定义
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const StatsCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  height: '100%',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '2px',
    background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, transparent)`,
  },
  '&:hover': {
    '& > *:first-of-type': {
      animation: `${pulse} 1.5s infinite`,
    }
  }
}));

const TransactionItem = styled(ListItem)<{ transactionType: string }>(({ theme, transactionType }) => {
  const getTypeColor = () => {
    switch (transactionType) {
      case '借款': return theme.palette.primary.main;
      case '还款': return theme.palette.success.main;
      case '质押': return theme.palette.secondary.main;
      default: return theme.palette.warning.main;
    }
  };
  
  const color = getTypeColor();
  
  return {
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(1),
    position: 'relative',
    background: alpha(theme.palette.background.paper, 0.2),
    border: `1px solid ${alpha(color, 0.3)}`,
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: '3px',
      background: color,
      boxShadow: `0 0 8px ${color}`,
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: `linear-gradient(90deg, ${alpha(color, 0.05)}, transparent)`,
      pointerEvents: 'none',
    },
    '&:hover': {
      boxShadow: `0 0 15px ${alpha(color, 0.3)}`,
      transform: 'translateX(5px)',
      '&::after': {
        background: `linear-gradient(90deg, ${alpha(color, 0.1)}, transparent)`,
      }
    },
  };
});

interface DashboardStats {
  totalLoans: number;
  activeLoans: number;
  totalValueLocked: number;
  creditScore: number;
  availableCredit: number;
  utilizationRate: number;
  // 新增字段
  governanceTokensStaked: number;
  governanceTokensHeld: number;
  stableCoinsLimit: number;
  stakingRewards: number;
  stakingPenalties: number;
  recentTransactions: Array<{
    type: string;
    amount: number;
    timestamp: string;
    hash: string;
  }>;
}

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { address: walletAddress } = useWallet();
  const [address, setAddress] = useState(walletAddress || '');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalLoans: 0,
    activeLoans: 0,
    totalValueLocked: 0,
    creditScore: 0,
    availableCredit: 0,
    utilizationRate: 0,
    // 新增字段初始化
    governanceTokensStaked: 0,
    governanceTokensHeld: 0,
    stableCoinsLimit: 0,
    stakingRewards: 0,
    stakingPenalties: 0,
    recentTransactions: []
  });

  useEffect(() => {
    if (walletAddress) {
      setAddress(walletAddress);
    }
  }, [walletAddress]);

  useEffect(() => {
    fetchDashboardData();
  }, [address]);

  const fetchDashboardData = async () => {
    if (!address) {
      setLoading(false);
      return;
    }

    setLoading(true);
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟数据
      const mockStats: DashboardStats = {
        totalLoans: Math.floor(Math.random() * 10) + 1,
        activeLoans: Math.floor(Math.random() * 5) + 1,
        totalValueLocked: Math.floor(Math.random() * 10000) + 5000,
        creditScore: Math.floor(Math.random() * 30) + 70,
        availableCredit: Math.floor(Math.random() * 5000) + 1000,
        utilizationRate: Math.floor(Math.random() * 80) + 10,
        // 新增字段数据
        governanceTokensStaked: Math.floor(Math.random() * 1000) + 100,
        governanceTokensHeld: Math.floor(Math.random() * 2000) + 500,
        stableCoinsLimit: Math.floor(Math.random() * 8000) + 2000,
        stakingRewards: Math.floor(Math.random() * 100) + 10,
        stakingPenalties: Math.floor(Math.random() * 20),
        recentTransactions: [
          {
            type: '借款',
            amount: 1000,
            timestamp: '2025-05-15 14:30',
            hash: '0x7f9e8d7c6b5a4c3d2e1f0a9b8c7d6e5f4a3b2c1d',
          },
          {
            type: '还款',
            amount: 500,
            timestamp: '2025-05-14 09:15',
            hash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
          },
          {
            type: '质押',
            amount: 2000,
            timestamp: '2025-05-13 18:45',
            hash: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
          },
          {
            type: '借款',
            amount: 800,
            timestamp: '2025-05-10 11:20',
            hash: '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f',
          },
        ]
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString();
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const getTransactionIcon = (type: string) => {
    return <TeamIconImage size={24} color={
      type === '借款' ? 'primary' : 
      type === '还款' ? 'success' : 
      'secondary'
    } />;
  };

  const getTransactionTypeText = (type: string) => {
    return type;
  };

  const formatDate = (date: string) => {
    return date;
  };

  if (loading && !refreshing) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 'calc(100vh - 64px)',
        background: `linear-gradient(135deg, ${alpha('#041209', 0.95)} 0%, ${alpha('#072116', 0.95)} 100%)`,
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      py: 8, 
      minHeight: 'calc(100vh - 64px)', 
      position: 'relative',
      background: `linear-gradient(135deg, ${alpha('#041209', 0.95)} 0%, ${alpha('#072116', 0.95)} 100%)`,
      overflow: 'hidden',
    }}>
      {/* 科技风格背景 */}
      <TechBackground />
      
      <Container maxWidth="lg">
        <Fade in={true} timeout={800}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PulseContainer>
                  <TeamIconImage size={50} color="primary" sx={{ mr: 2 }} />
                </PulseContainer>
                <NeonText>
                  <Typography 
                    variant="h3" 
                    component="h1" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 700, 
                      textAlign: 'center',
                      mb: 0,
                      color: '#fff',
                      textShadow: `0 0 10px ${theme.palette.primary.main}`,
                    }}
                  >
                    仪表盘
                  </Typography>
                </NeonText>
              </Box>
              
              <Tooltip title="刷新数据">
                <IconButton 
                  onClick={handleRefresh} 
                  color="primary"
                  disabled={refreshing}
                  sx={{ 
                    background: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      background: alpha(theme.palette.primary.main, 0.2),
                    }
                  }}
                >
                  {refreshing ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <RefreshIcon />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
            
            {/* 用户信息卡片 */}
            {address ? (
              <DataCard sx={{ mb: 4 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      sx={{ 
                        width: 60, 
                        height: 60, 
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        mr: 2
                      }}
                    >
                      <TeamLogo />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="600" sx={{ color: '#fff' }}>
                        {formatAddress(address || '')}
                      </Typography>
                      <Chip 
                        label={`信用评分: ${stats.creditScore}`} 
                        size="small"
                        sx={{ 
                          color: '#fff',
                          fontWeight: 500,
                          mt: 1,
                          background: alpha(stats.creditScore >= 90 ? theme.palette.success.main : 
                                         stats.creditScore >= 80 ? theme.palette.primary.main : 
                                         stats.creditScore >= 70 ? theme.palette.secondary.main : 
                                         theme.palette.warning.main, 0.2),
                          borderColor: stats.creditScore >= 90 ? theme.palette.success.main : 
                                         stats.creditScore >= 80 ? theme.palette.primary.main : 
                                         stats.creditScore >= 70 ? theme.palette.secondary.main : 
                                         theme.palette.warning.main
                        }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </DataCard>
            ) : (
              <Alert severity="info" sx={{ mb: 4 }}>
                请连接钱包以查看您的仪表盘信息
              </Alert>
            )}
            
            {address && (
              <>
                {/* 统计卡片 */}
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" component="h2" fontWeight="600" sx={{ color: '#fff' }}>
                      借贷统计
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate('/repayment')}
                      startIcon={<TeamIconImage size={20} color="inherit" />}
                      sx={{ 
                        borderRadius: 2,
                        background: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                        '&:hover': {
                          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                          boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.5)}`
                        }
                      }}
                    >
                      前往还款
                    </Button>
                  </Box>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <DataCard>
                        <StatsCard>
                          <TeamIconImage size={40} color="primary" sx={{ mb: 1 }} />
                          <Typography variant="body2" sx={{ color: '#fff' }} gutterBottom>
                            历史借款
                          </Typography>
                          <Typography variant="h5" fontWeight="700" sx={{ color: '#fff' }}>
                            {stats.totalLoans} 笔
                          </Typography>
                        </StatsCard>
                      </DataCard>
                    </Grid>
                    
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <DataCard>
                        <StatsCard>
                          <TeamIconImage size={40} color="success" sx={{ mb: 1 }} />
                          <Typography variant="body2" sx={{ color: '#fff' }} gutterBottom>
                            活跃借款
                          </Typography>
                          <Typography variant="h5" fontWeight="700" sx={{ color: '#fff' }}>
                            {stats.activeLoans} 笔
                          </Typography>
                        </StatsCard>
                      </DataCard>
                    </Grid>
                    
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <DataCard>
                        <StatsCard>
                          <TeamIconImage size={40} color="warning" sx={{ mb: 1 }} />
                          <Typography variant="body2" sx={{ color: '#fff' }} gutterBottom>
                            资金利用率
                          </Typography>
                          <Box sx={{ width: '100%', mt: 1 }}>
                            <Typography variant="h5" fontWeight="700" sx={{ color: '#fff' }}>
                              {stats.utilizationRate}%
                            </Typography>
                            <LinearProgress 
                              variant="determinate" 
                              value={stats.utilizationRate} 
                              sx={{ 
                                mt: 1, 
                                height: 8, 
                                borderRadius: 4,
                                bgcolor: alpha(theme.palette.warning.main, 0.1),
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: theme.palette.warning.main,
                                  borderRadius: 4,
                                }
                              }} 
                            />
                          </Box>
                        </StatsCard>
                      </DataCard>
                    </Grid>
                    
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <DataCard>
                        <StatsCard>
                          <TeamIconImage size={40} color="info" sx={{ mb: 1 }} />
                          <Typography variant="body2" sx={{ color: '#fff' }} gutterBottom>
                            稳定币可借额度
                          </Typography>
                          <Typography variant="h5" fontWeight="700" sx={{ color: '#fff' }}>
                            {formatAmount(stats.stableCoinsLimit)} USDC
                          </Typography>
                        </StatsCard>
                      </DataCard>
                    </Grid>
                  </Grid>
                </Box>
                
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" component="h2" fontWeight="600" sx={{ mb: 2, color: '#fff' }}>
                    治理代币统计
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <DataCard>
                        <StatsCard>
                          <TeamIconImage size={40} color="primary" sx={{ mb: 1 }} />
                          <Typography variant="body2" sx={{ color: '#fff' }} gutterBottom>
                            治理代币质押数量
                          </Typography>
                          <Typography variant="h5" fontWeight="700" sx={{ color: '#fff' }}>
                            {stats.governanceTokensStaked} TEAM
                          </Typography>
                        </StatsCard>
                      </DataCard>
                    </Grid>
                    
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <DataCard>
                        <StatsCard>
                          <TeamIconImage size={40} color="secondary" sx={{ mb: 1 }} />
                          <Typography variant="body2" sx={{ color: '#fff' }} gutterBottom>
                            治理代币持有数量
                          </Typography>
                          <Typography variant="h5" fontWeight="700" sx={{ color: '#fff' }}>
                            {stats.governanceTokensHeld} TEAM
                          </Typography>
                        </StatsCard>
                      </DataCard>
                    </Grid>
                    
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <DataCard>
                        <StatsCard>
                          <TeamIconImage size={40} color="success" sx={{ mb: 1 }} />
                          <Typography variant="body2" sx={{ color: '#fff' }} gutterBottom>
                            质押分红
                          </Typography>
                          <Typography variant="h5" fontWeight="700" sx={{ color: '#fff' }}>
                            {stats.stakingRewards} TEAM
                          </Typography>
                        </StatsCard>
                      </DataCard>
                    </Grid>
                    
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <DataCard>
                        <StatsCard>
                          <TeamIconImage size={40} color="error" sx={{ mb: 1 }} />
                          <Typography variant="body2" sx={{ color: '#fff' }} gutterBottom>
                            质押惩罚
                          </Typography>
                          <Typography variant="h5" fontWeight="700" sx={{ color: '#fff' }}>
                            {stats.stakingPenalties} TEAM
                          </Typography>
                        </StatsCard>
                      </DataCard>
                    </Grid>
                  </Grid>
                </Box>
                
                {/* 最近交易 */}
                <DataCard>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TeamIconImage size={28} color="primary" sx={{ mr: 1 }} />
                        <NeonText>
                          <Typography variant="h5" component="h2" fontWeight="600" sx={{ color: '#fff' }}>
                            最近交易
                          </Typography>
                        </NeonText>
                      </Box>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/repayment')}
                        startIcon={<TeamIconImage size={20} color="inherit" />}
                        sx={{ 
                          borderRadius: 2,
                          background: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                          '&:hover': {
                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                            boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.5)}`
                          }
                        }}
                      >
                        前往还款
                      </Button>
                    </Box>
                    
                    <List sx={{ p: 0 }}>
                      {stats.recentTransactions.map((transaction, index) => (
                        <TransactionItem key={index} transactionType={transaction.type}>
                          <ListItemIcon>
                            {getTransactionIcon(transaction.type)}
                          </ListItemIcon>
                          <ListItemText
                            primary={<Typography sx={{ color: '#fff' }}>{getTransactionTypeText(transaction.type)}</Typography>}
                            secondary={
                              <>
                                <Typography component="span" variant="body2" sx={{ color: '#fff', opacity: 0.8 }}>
                                  {formatAmount(transaction.amount)} USDC
                                </Typography>
                                <br />
                                <Typography component="span" variant="caption" sx={{ color: '#fff', opacity: 0.6 }}>
                                  {formatDate(transaction.timestamp)}
                                </Typography>
                              </>
                            }
                          />
                        </TransactionItem>
                      ))}
                    </List>
                  </CardContent>
                </DataCard>
              </>
            )}
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Dashboard;
