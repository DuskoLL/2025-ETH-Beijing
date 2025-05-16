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
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  InputAdornment,
  Stack,
  Grid,
  Paper,
  Divider,
  Chip,
  Fade,
  Slide,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  Avatar,
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

const StyledStepLabel = styled(StepLabel)(({ theme }) => ({
  '& .MuiStepLabel-label': {
    fontWeight: 500,
  },
  '& .MuiStepLabel-label.Mui-active': {
    fontWeight: 700,
    color: theme.palette.primary.main,
  },
  '& .MuiStepLabel-label.Mui-completed': {
    fontWeight: 700,
    color: theme.palette.success.main,
  },
}));

const AnimatedInfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    transform: 'translateX(5px)',
  },
}));

const LoanDetailItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.background.paper, 0.5),
  marginBottom: theme.spacing(2),
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

const StepContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.background.paper, 0.5),
}));

const steps = ['填写借款信息', '确认借款详情', '完成借贷'];

interface LoanInfo {
  amount: number;
  duration: number;
  rate: number;
  totalInterest: number;
  totalRepayment: number;
  creditScore: number;
  maxAmount: number;
}

const Lending: React.FC = () => {
  const theme = useTheme();
  const { address, isConnected } = useWallet();
  const [activeStep, setActiveStep] = useState(0);
  const [loanInfo, setLoanInfo] = useState<LoanInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [loanDuration, setLoanDuration] = useState('30');
  const [completed, setCompleted] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');

  // 检查钱包连接状态
  useEffect(() => {
    if (!isConnected) {
      setError('请先连接钱包后再申请借款');
    } else {
      setError('');
    }
  }, [isConnected]);

  const handleNext = () => {
    if (activeStep === 0) {
      handleCalculateLoan();
    } else if (activeStep === 1) {
      handleConfirmLoan();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // 计算借款详情
  const handleCalculateLoan = async () => {
    if (!loanAmount || !loanDuration) {
      setError('请填写借款金额和期限');
      return;
    }

    if (parseInt(loanAmount) <= 0 || parseInt(loanDuration) <= 0) {
      setError('借款金额和期限必须大于0');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 根据信用评分动态计算利率
      const creditScore = Math.floor(Math.random() * 30) + 70; // 70-100
      let rate = 0.08; // 基础利率
      
      // 根据信用评分调整利率
      if (creditScore >= 90) {
        rate = 0.05;
      } else if (creditScore >= 80) {
        rate = 0.06;
      } else if (creditScore >= 70) {
        rate = 0.07;
      }
      
      const amount = parseInt(loanAmount);
      const duration = parseInt(loanDuration);
      const totalInterest = amount * rate * (duration / 365);
      const totalRepayment = amount + totalInterest;
      const maxAmount = creditScore * 1000; // 最大借款额度与信用分数相关
      
      const mockLoanInfo: LoanInfo = {
        amount,
        duration,
        rate,
        totalInterest,
        totalRepayment,
        creditScore,
        maxAmount
      };
      
      setLoanInfo(mockLoanInfo);
      setActiveStep(1);
    } catch (err) {
      setError('借贷计算失败');
    } finally {
      setLoading(false);
    }
  };

  // 确认借款
  const handleConfirmLoan = async () => {
    if (!loanInfo) return;
    
    setLoading(true);
    setError('');
    
    try {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 模拟交易哈希
      const hash = '0x' + Array.from({length: 64}, () => 
        Math.floor(Math.random() * 16).toString(16)).join('');
      
      setTransactionHash(hash);
      setCompleted(true);
      setActiveStep(2);
    } catch (err) {
      setError('借款交易失败');
    } finally {
      setLoading(false);
    }
  };
  
  // 重置借款流程
  const handleReset = () => {
    setActiveStep(0);
    setLoanInfo(null);
    setLoanAmount('');
    setLoanDuration('');
    setCompleted(false);
    setTransactionHash('');
    setError('');
  };
  
  // 格式化利率显示
  const formatRate = (rate: number) => {
    return (rate * 100).toFixed(2) + '%';
  };
  
  // 格式化金额显示
  const formatAmount = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // 渲染第一步 - 填写借款信息
  const renderStep1 = () => (
    <Fade in={activeStep === 0} timeout={800}>
      <Box>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            <GlassCard>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <TeamLogo color="primary" sx={{ fontSize: 28, mr: 1 }} />
                  <Typography variant="h5" component="h2" fontWeight="600">
                    借款申请
                  </Typography>
                </Box>
                
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle1" fontWeight="500" gutterBottom>
                      借款金额 (USDC)
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      placeholder="输入借款金额"
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><TeamLogo fontSize="small" /></InputAdornment>,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                    <Typography variant="caption" color="primary" sx={{ display: 'block', mt: 1, fontWeight: 500 }}>
                      可借额度: {loanInfo ? formatAmount(loanInfo.maxAmount) : '5,000'} USDC
                    </Typography>
                  </Grid>
                  
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle1" fontWeight="500" gutterBottom>
                      借款期限 (天)
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      value="30"
                      disabled
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><TeamLogo fontSize="small" /></InputAdornment>,
                        readOnly: true,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                        '& .Mui-disabled': {
                          opacity: 0.8,
                          '-webkit-text-fill-color': '#fff',
                        }
                      }}
                    />
                    <Typography variant="caption" color="info.main" sx={{ display: 'block', mt: 1, fontWeight: 500 }}>
                      借款期限固定为30天
                    </Typography>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    variant="outlined"
                    color="inherit"
                    disabled
                    startIcon={<ArrowBackIcon />}
                  >
                    返回
                  </Button>
                  
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <TeamLogo fontSize="small" />}
                    disabled={loading || !isConnected}
                    sx={{
                      py: 1.2,
                      px: 3,
                      fontSize: '1rem',
                      fontWeight: 600,
                    }}
                  >
                    {loading ? '计算中...' : '计算借款详情'}
                  </Button>
                </Box>
                
                {error && (
                  <Alert severity="error" sx={{ mt: 3 }}>
                    {error}
                  </Alert>
                )}
              </CardContent>
            </GlassCard>
          </Grid>
          
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={3}>
              <GlassCard>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CreditScoreIcon color="primary" sx={{ fontSize: 24, mr: 1 }} />
                    <Typography variant="h6" fontWeight="600">
                      信用评分影响
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    您的链上信用评分将直接影响借款利率和可借额度。评分越高，利率越低，可借额度越高。
                  </Typography>
                </CardContent>
              </GlassCard>
              
              <GlassCard>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PercentIcon color="secondary" sx={{ fontSize: 24, mr: 1 }} />
                    <Typography variant="h6" fontWeight="600">
                      利率范围
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">优质信用</Typography>
                    <Typography variant="body2" fontWeight="600" color="success.main">5%</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">良好信用</Typography>
                    <Typography variant="body2" fontWeight="600" color="primary.main">6%</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">普通信用</Typography>
                    <Typography variant="body2" fontWeight="600" color="secondary.main">7%</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">一般信用</Typography>
                    <Typography variant="body2" fontWeight="600" color="warning.main">8%</Typography>
                  </Box>
                </CardContent>
              </GlassCard>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
  
  // 渲染第二步 - 确认借款详情
  const renderStep2 = () => (
    <Fade in={activeStep === 1} timeout={800}>
      <Box>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            <GlassCard>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <ReceiptIcon color="primary" sx={{ fontSize: 28, mr: 1 }} />
                  <Typography variant="h5" component="h2" fontWeight="600">
                    借款详情确认
                  </Typography>
                </Box>
                
                {loanInfo && (
                  <Box>
                    <Box sx={{ mb: 4, p: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Box sx={{ textAlign: 'center', p: 2 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              借款金额
                            </Typography>
                            <Typography variant="h4" fontWeight="700" color="primary.main">
                              {formatAmount(loanInfo.amount)} USDC
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Box sx={{ textAlign: 'center', p: 2 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              年化利率
                            </Typography>
                            <Typography variant="h4" fontWeight="700" color="secondary.main">
                              {formatRate(loanInfo.rate)}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                      借款详细信息
                    </Typography>
                    
                    <LoanDetailItem>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
                        <Typography variant="body1">借款期限</Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="500">
                        {loanInfo.duration} 天
                      </Typography>
                    </LoanDetailItem>
                    
                    <LoanDetailItem>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <MoneyIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
                        <Typography variant="body1">利息总额</Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="500">
                        {formatAmount(loanInfo.totalInterest)} USDC
                      </Typography>
                    </LoanDetailItem>
                    
                    <LoanDetailItem>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocalAtmIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
                        <Typography variant="body1">还款总额</Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="500">
                        {formatAmount(loanInfo.totalRepayment)} USDC
                      </Typography>
                    </LoanDetailItem>
                    
                    <LoanDetailItem>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CreditScoreIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
                        <Typography variant="body1">您的信用评分</Typography>
                      </Box>
                      <Chip 
                        label={loanInfo.creditScore} 
                        color={loanInfo.creditScore >= 90 ? "success" : 
                               loanInfo.creditScore >= 80 ? "primary" : 
                               loanInfo.creditScore >= 70 ? "secondary" : "warning"}
                        size="small"
                      />
                    </LoanDetailItem>
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                      <Button
                        variant="outlined"
                        color="inherit"
                        onClick={handleBack}
                        startIcon={<ArrowBackIcon />}
                        disabled={loading}
                      >
                        返回修改
                      </Button>
                      
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleConfirmLoan}
                        endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
                        disabled={loading}
                        sx={{
                          py: 1.2,
                          px: 3,
                          fontSize: '1rem',
                          fontWeight: 600,
                        }}
                      >
                        {loading ? '处理中...' : '确认借款'}
                      </Button>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </GlassCard>
          </Grid>
          
          <Grid size={{ xs: 12, md: 4 }}>
            <GlassCard>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <InfoIcon color="primary" sx={{ fontSize: 24, mr: 1 }} />
                  <Typography variant="h6" fontWeight="600">
                    借贷说明
                  </Typography>
                </Box>
                
                <AnimatedInfoItem>
                  <Typography variant="body2">
                    1. 本协议采用AI信用评分系统，根据您的链上行为自动评估信用等级
                  </Typography>
                </AnimatedInfoItem>
                
                <AnimatedInfoItem>
                  <Typography variant="body2">
                    2. 借款利率根据信用等级动态调整，信用越好利率越低
                  </Typography>
                </AnimatedInfoItem>
                
                <AnimatedInfoItem>
                  <Typography variant="body2">
                    3. 还款日期为借款期限到期日，退还全部本息
                  </Typography>
                </AnimatedInfoItem>
                
                <AnimatedInfoItem>
                  <Typography variant="body2">
                    4. 违约将影响信用评分并可能触发治理代币惩罚机制
                  </Typography>
                </AnimatedInfoItem>
              </CardContent>
            </GlassCard>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
  
  // 渲染第三步 - 完成借贷
  const renderStep3 = () => (
    <Fade in={activeStep === 2} timeout={800}>
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <GlassCard sx={{ maxWidth: 600, mx: 'auto' }}>
          <CardContent sx={{ p: 5 }}>
            <Box sx={{ mb: 4 }}>
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  color: theme.palette.success.main,
                  mx: 'auto',
                  mb: 3
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 40 }} />
              </Avatar>
              
              <Typography variant="h4" component="h2" fontWeight="700" gutterBottom>
                借款成功！
              </Typography>
              
              <Typography variant="body1" color="text.secondary" paragraph>
                您的借款请求已经处理成功，资金将在几分钟内到账。
              </Typography>
            </Box>
            
            {transactionHash && (
              <Box sx={{ mb: 4, p: 3, bgcolor: alpha(theme.palette.background.paper, 0.5), borderRadius: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  交易哈希
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    wordBreak: 'break-all',
                    fontFamily: 'monospace'
                  }}
                >
                  {transactionHash}
                </Typography>
              </Box>
            )}
            
            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleReset}
                sx={{
                  py: 1.2,
                  px: 3,
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                申请新借款
              </Button>
            </Box>
          </CardContent>
        </GlassCard>
      </Box>
    </Fade>
  );

  return (
    <Box sx={{ py: 8, minHeight: 'calc(100vh - 64px)', background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.05)} 0%, ${alpha(theme.palette.secondary.dark, 0.1)} 100%)` }}>
      <Container maxWidth="lg">
        <Fade in={true} timeout={800}>
          <Box>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 700, 
                textAlign: 'center',
                mb: 5,
                background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              去中心化借贷平台
            </Typography>
            
            <Stepper 
              activeStep={activeStep} 
              sx={{ 
                mb: 5,
                '& .MuiStepConnector-line': {
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                },
                '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
                  borderColor: theme.palette.primary.main,
                },
                '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StyledStepLabel>{label}</StyledStepLabel>
                </Step>
              ))}
            </Stepper>
            
            {activeStep === 0 && renderStep1()}
            {activeStep === 1 && renderStep2()}
            {activeStep === 2 && renderStep3()}
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Lending;
