import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  InputAdornment,
  Stack,
  Grid,
  Divider,
  Chip,
  Fade,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useWallet } from '../hooks/useWallet';
import {
  TeamLogo,
  ArrowBackTeamIcon as ArrowBackIcon,
  CreditTeamIcon as CreditScoreIcon,
  PercentTeamIcon as PercentIcon,
  ReceiptTeamIcon as ReceiptIcon,
  CalendarTeamIcon as CalendarIcon,
  MoneyTeamIcon as MoneyIcon,
  LocalAtmTeamIcon as LocalAtmIcon,
  CheckCircleTeamIcon as CheckCircleIcon,
  InfoTeamIcon as InfoIcon
} from '../components/TeamIcons';
import TeamIconImage from '../components/TeamIconImage';
import { useNavigate } from 'react-router-dom';
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

// 样式化组件
const GlassCard = styled(Card)(({ theme }) => ({
  background: alpha(theme.palette.background.paper, 0.7),
  backdropFilter: 'blur(10px)',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.2)}`,
  overflow: 'hidden',
  border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: `0 12px 40px 0 ${alpha(theme.palette.common.black, 0.3)}`,
  },
}));

const LoanItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  marginBottom: theme.spacing(2),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    transform: 'translateX(5px)',
  },
}));

interface Loan {
  id: string;
  amount: number;
  dueDate: string;
  interest: number;
  totalDue: number;
  status: 'active' | 'overdue' | 'paid';
  creditBoost: number;
  // 新增字段
  riskPoolInterest: number; // 风险池分配利息
  lenderInterest: number; // 借款人分配利息
  collateralAmount: number; // 抵押品金额
}

const Repayment: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { address: walletAddress, isConnected } = useWallet();
  const [address, setAddress] = useState(walletAddress || '');
  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [repaymentAmount, setRepaymentAmount] = useState('');
  const [repaymentDialogOpen, setRepaymentDialogOpen] = useState(false);
  const [repaying, setRepaying] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (walletAddress) {
      setAddress(walletAddress);
    }
  }, [walletAddress]);

  useEffect(() => {
    fetchLoans();
  }, [address]);

  const fetchLoans = async () => {
    if (!address) {
      setLoading(false);
      return;
    }

    setLoading(true);
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟数据
      const mockLoans: Loan[] = [
        {
          id: '1',
          amount: 1000,
          dueDate: '2025-06-15',
          interest: 50,
          totalDue: 1050,
          status: 'active',
          creditBoost: 2,
          riskPoolInterest: 10, // 20%进入风险池
          lenderInterest: 40, // 80%给借款人
          collateralAmount: 1500 // 150%抵押率
        },
        {
          id: '2',
          amount: 500,
          dueDate: '2025-06-10',
          interest: 20,
          totalDue: 520,
          status: 'overdue',
          creditBoost: 3,
          riskPoolInterest: 4, // 20%进入风险池
          lenderInterest: 16, // 80%给借款人
          collateralAmount: 750 // 150%抵押率
        },
        {
          id: '3',
          amount: 2000,
          dueDate: '2025-06-20',
          interest: 100,
          totalDue: 2100,
          status: 'active',
          creditBoost: 5,
          riskPoolInterest: 20, // 20%进入风险池
          lenderInterest: 80, // 80%给借款人
          collateralAmount: 3000 // 150%抵押率
        },
        {
          id: '4',
          amount: 800,
          dueDate: '2025-05-30',
          interest: 40,
          totalDue: 840,
          status: 'paid',
          creditBoost: 1,
          riskPoolInterest: 8, // 20%进入风险池
          lenderInterest: 32, // 80%给借款人
          collateralAmount: 1200 // 150%抵押率
        }
      ];
      
      setLoans(mockLoans);
    } catch (error) {
      console.error('Error fetching loans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRepaymentDialog = (loan: Loan) => {
    setSelectedLoan(loan);
    setRepaymentAmount(loan.totalDue.toString());
    setRepaymentDialogOpen(true);
  };

  const handleCloseRepaymentDialog = () => {
    setRepaymentDialogOpen(false);
    setSelectedLoan(null);
    setRepaymentAmount('');
    setError('');
  };

  const handleRepay = async () => {
    if (!selectedLoan) return;
    
    setRepaying(true);
    setError('');
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 更新贷款状态
      setLoans(prevLoans => 
        prevLoans.map(loan => 
          loan.id === selectedLoan.id 
            ? { ...loan, status: 'paid' } 
            : loan
        )
      );
      
      setSuccessMessage(`成功还款 ${parseFloat(repaymentAmount).toFixed(2)} USDC！信用评分提升了 ${selectedLoan.creditBoost} 点。`);
      setSnackbarOpen(true);
      handleCloseRepaymentDialog();
    } catch (err) {
      setError('还款失败，请稍后再试');
    } finally {
      setRepaying(false);
    }
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'active':
        return <Chip label="进行中" color="primary" size="small" />;
      case 'overdue':
        return <Chip label="已逾期" color="error" size="small" />;
      case 'paid':
        return <Chip label="已还款" color="success" size="small" />;
      default:
        return <Chip label="未知" color="default" size="small" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  if (loading) {
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
                    还款中心
                  </Typography>
                </NeonText>
              </Box>
              
              <Button
                variant="outlined"
                color="primary"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/dashboard')}
                sx={{ 
                  background: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    background: alpha(theme.palette.primary.main, 0.2),
                  }
                }}
              >
                返回仪表盘
              </Button>
            </Box>
            
            {!isConnected ? (
              <Alert severity="info" sx={{ mb: 4 }}>
                请连接钱包以查看您的贷款信息
              </Alert>
            ) : loans.length === 0 ? (
              <GlassCard>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box sx={{ mb: 3 }}>
                    <TeamIconImage size={60} color="info" />
                  </Box>
                  <Typography variant="h5" gutterBottom>
                    暂无贷款记录
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    您当前没有需要还款的贷款
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => navigate('/lending')}
                    sx={{ mt: 2 }}
                  >
                    申请新贷款
                  </Button>
                </CardContent>
              </GlassCard>
            ) : (
              <>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" component="h2" fontWeight="600" sx={{ mb: 2, color: '#fff' }}>
                    贷款还款
                  </Typography>
                  <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="body2">
                      按时还款可以提高您的信用评分，逾期还款会降低信用评分。
                    </Typography>
                  </Alert>
                  
                  <Grid container spacing={3}>
                    {loans.filter(loan => loan.status !== 'paid').map((loan) => (
                      <Grid size={{ xs: 12, md: 6 }} key={loan.id}>
                        <DataCard>
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Typography variant="h6" fontWeight="600" sx={{ color: '#fff' }}>
                                贷款 #{loan.id}
                              </Typography>
                              {getStatusChip(loan.status)}
                            </Box>
                            
                            <Divider sx={{ my: 2 }} />
                            
                            <Box sx={{ mb: 2 }}>
                              <Grid container spacing={2}>
                                <Grid size={{ xs: 6 }}>
                                  <Typography variant="body2" color="text.secondary">贷款金额</Typography>
                                  <Typography variant="body1" fontWeight="500" sx={{ color: '#fff' }}>
                                    {formatAmount(loan.amount)} USDC
                                  </Typography>
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                  <Typography variant="body2" color="text.secondary">应还总额</Typography>
                                  <Typography variant="body1" fontWeight="500" sx={{ color: '#fff' }}>
                                    {formatAmount(loan.totalDue)} USDC
                                  </Typography>
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                  <Typography variant="body2" color="text.secondary">到期日</Typography>
                                  <Typography variant="body1" fontWeight="500" sx={{ color: '#fff' }}>
                                    {formatDate(loan.dueDate)}
                                  </Typography>
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                  <Typography variant="body2" color="text.secondary">信用提升</Typography>
                                  <Typography variant="body1" fontWeight="500" sx={{ color: theme.palette.success.main }}>
                                    +{loan.creditBoost} 分
                                  </Typography>
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                  <Typography variant="body2" color="text.secondary">借款人利息(80%)</Typography>
                                  <Typography variant="body1" fontWeight="500" sx={{ color: '#fff' }}>
                                    {formatAmount(loan.lenderInterest)} USDC
                                  </Typography>
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                  <Typography variant="body2" color="text.secondary">风险池利息(20%)</Typography>
                                  <Typography variant="body1" fontWeight="500" sx={{ color: theme.palette.warning.main }}>
                                    {formatAmount(loan.riskPoolInterest)} USDC
                                  </Typography>
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                  <Typography variant="body2" color="text.secondary">抵押品金额</Typography>
                                  <Typography variant="body1" fontWeight="500" sx={{ color: '#fff' }}>
                                    {formatAmount(loan.collateralAmount)} ETH
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Box>
                            
                            <Button
                              variant="contained"
                              color={loan.status === 'overdue' ? 'error' : 'primary'}
                              fullWidth
                              onClick={() => handleOpenRepaymentDialog(loan)}
                              sx={{ mt: 2 }}
                            >
                              {loan.status === 'overdue' ? '逾期还款' : '立即还款'}
                            </Button>
                          </CardContent>
                        </DataCard>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
                
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" component="h2" fontWeight="600" sx={{ mb: 2, color: '#fff' }}>
                    还款历史
                  </Typography>
                  
                  <DataCard>
                    <CardContent sx={{ p: 3 }}>
                      {loans.filter(loan => loan.status === 'paid').length > 0 ? (
                        <List sx={{ p: 0 }}>
                          {loans.filter(loan => loan.status === 'paid').map((loan) => (
                            <LoanItem key={loan.id}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                  <Typography variant="subtitle1" fontWeight="600" sx={{ color: '#fff' }}>
                                    贷款 #{loan.id}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    已还款: {formatAmount(loan.totalDue)} USDC
                                  </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                  <Chip 
                                    label="已还款" 
                                    color="success" 
                                    size="small" 
                                    sx={{ mb: 1 }} 
                                  />
                                  <Typography variant="body2" color="text.secondary">
                                    信用提升: +{loan.creditBoost} 分
                                  </Typography>
                                </Box>
                              </Box>
                            </LoanItem>
                          ))}
                        </List>
                      ) : (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="body1" color="text.secondary">
                            暂无还款历史记录
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </DataCard>
                </Box>
              </>
            )}
          </Box>
        </Fade>
      </Container>
      
      {/* 还款对话框 */}
      <Dialog open={repaymentDialogOpen} onClose={handleCloseRepaymentDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TeamIconImage size={24} color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">确认还款</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedLoan && (
            <>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" gutterBottom>
                  您正在为贷款 #{selectedLoan.id} 进行还款
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  按时还款将提高您的信用评分 +{selectedLoan.creditBoost} 分
                </Typography>
              </Box>
              
              <TextField
                label="还款金额"
                type="number"
                value={repaymentAmount}
                onChange={(e) => setRepaymentAmount(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">USDC</InputAdornment>,
                }}
                sx={{ mb: 3 }}
              />
              
              <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), p: 2, borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>还款详情</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">贷款金额</Typography>
                    <Typography variant="body1">{formatAmount(selectedLoan.amount)} USDC</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">利息</Typography>
                    <Typography variant="body1">{formatAmount(selectedLoan.interest)} USDC</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">应还总额</Typography>
                    <Typography variant="body1" fontWeight="600">{formatAmount(selectedLoan.totalDue)} USDC</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">到期日</Typography>
                    <Typography variant="body1">{formatDate(selectedLoan.dueDate)}</Typography>
                  </Grid>
                </Grid>
              </Box>
              
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRepaymentDialog} disabled={repaying}>
            取消
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleRepay}
            disabled={repaying || !repaymentAmount || parseFloat(repaymentAmount) < (selectedLoan?.totalDue || 0)}
            startIcon={repaying ? <CircularProgress size={20} /> : null}
          >
            {repaying ? '处理中...' : '确认还款'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 成功消息提示 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={successMessage}
        action={
          <Button color="primary" size="small" onClick={() => setSnackbarOpen(false)}>
            关闭
          </Button>
        }
      />
    </Box>
  );
};

export default Repayment;
