import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  CircularProgress, 
  Chip,
  Alert,
  LinearProgress,
  Divider,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { 
  useGetAdjustedCreditScoreQuery,
  useAddToBlacklistMutation,
  useRemoveFromBlacklistMutation
} from '../services/washTradeService';

// 玻璃态卡片效果
const GlassCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.25)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.shape.borderRadius,
  border: '1px solid rgba(255, 255, 255, 0.18)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 30px 0 rgba(31, 38, 135, 0.5)',
  },
}));

// 渐变文字
const GradientText = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(45deg, #6e8efb 30%, #a777e3 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  fontWeight: 'bold',
}));

// 信用评分圆环
const CreditScoreCircle = styled(Box)<{ score: number }>(({ theme, score }) => {
  let color = '#4caf50'; // 高分 - 绿色
  if (score < 600) color = '#f44336'; // 低分 - 红色
  else if (score < 750) color = '#ff9800'; // 中分 - 橙色

  return {
    position: 'relative',
    width: '150px',
    height: '150px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    background: `conic-gradient(${color} ${score/10}%, #e0e0e0 0)`,
    '&::before': {
      content: '""',
      position: 'absolute',
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      background: theme.palette.background.paper,
    },
  };
});

// 信用评分文字
const ScoreText = styled(Typography)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  fontWeight: 'bold',
  fontSize: '2rem',
}));

interface WashTradeCheckProps {
  address: string;
  originalScore?: number;
}

const WashTradeCheck: React.FC<WashTradeCheckProps> = ({ 
  address,
  originalScore = 800
}) => {
  const [token, setToken] = useState('LINK');
  const [score, setScore] = useState(originalScore);
  
  // 获取调整后的信用评分
  const { data, isLoading, error, refetch } = useGetAdjustedCreditScoreQuery({
    address,
    originalScore: score,
    token
  }, { skip: !address });
  
  // 添加/移除黑名单的API调用
  const [addToBlacklist, { isLoading: isAdding }] = useAddToBlacklistMutation();
  const [removeFromBlacklist, { isLoading: isRemoving }] = useRemoveFromBlacklistMutation();
  
  // 处理添加到黑名单
  const handleAddToBlacklist = async () => {
    if (address) {
      await addToBlacklist({ address, token });
      refetch();
    }
  };
  
  // 处理从黑名单中移除
  const handleRemoveFromBlacklist = async () => {
    if (address) {
      await removeFromBlacklist({ address, token });
      refetch();
    }
  };
  
  // 计算调整后的分数
  const adjustedScore = data 
    ? Math.round(score * data.recommendation.max_loan_amount_factor) 
    : score;
  
  // 计算惩罚分数
  const penaltyScore = data && data.wash_trade_check.detected
    ? Math.round(score * (1 - data.recommendation.max_loan_amount_factor))
    : 0;
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        无法获取对敲交易检测结果。请稍后再试。
      </Alert>
    );
  }
  
  return (
    <GlassCard sx={{ mb: 3, overflow: 'visible' }}>
      <CardContent>
        <GradientText variant="h5" gutterBottom>
          对敲交易检测 & 信用评分
        </GradientText>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
          <Box sx={{ width: { xs: '100%', md: '50%' } }}>
            <Box sx={{ mb: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>代币</InputLabel>
                <Select
                  value={token}
                  label="代币"
                  onChange={(e) => setToken(e.target.value)}
                >
                  <MenuItem value="LINK">Chainlink (LINK)</MenuItem>
                  <MenuItem value="UNI">Uniswap (UNI)</MenuItem>
                  <MenuItem value="AAVE">Aave (AAVE)</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="原始信用评分"
                type="number"
                size="small"
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                inputProps={{ min: 300, max: 900 }}
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => refetch()}
                fullWidth
              >
                重新检测
              </Button>
            </Box>
          </Box>
          
          <Box sx={{ width: { xs: '100%', md: '50%' } }}>
            <Box sx={{ textAlign: 'center' }}>
              <CreditScoreCircle score={adjustedScore / 9}>
                <ScoreText>{adjustedScore}</ScoreText>
              </CreditScoreCircle>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                原始评分: {score}
              </Typography>
              
              {data?.wash_trade_check.detected && (
                <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>
                  对敲交易惩罚: -{penaltyScore}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
        
        {data && (
          <>
            <Box sx={{ mb: 3 }}>
              <Alert 
                severity={data.wash_trade_check.detected ? "warning" : "success"}
                icon={data.wash_trade_check.detected ? <WarningIcon /> : <CheckCircleIcon />}
              >
                {data.wash_trade_check.detected 
                  ? "检测到对敲交易行为，信用评分已调整。" 
                  : "未检测到对敲交易行为。"}
              </Alert>
            </Box>
            
            {data.wash_trade_check.detected && data.wash_trade_check.info && (
              <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(255, 152, 0, 0.1)', borderRadius: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <WarningIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1, color: 'warning.main' }} />
                  对敲交易详情
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ width: 'calc(50% - 8px)' }}>
                    <Typography variant="body2" color="text.secondary">对敲交易次数:</Typography>
                    <Typography variant="body1">{data.wash_trade_check.info.count}</Typography>
                  </Box>
                  <Box sx={{ width: 'calc(50% - 8px)' }}>
                    <Typography variant="body2" color="text.secondary">对敲交易量:</Typography>
                    <Typography variant="body1">{data.wash_trade_check.info.volume.toLocaleString()}</Typography>
                  </Box>
                  <Box sx={{ width: 'calc(50% - 8px)' }}>
                    <Typography variant="body2" color="text.secondary">首次检测时间:</Typography>
                    <Typography variant="body1">{data.wash_trade_check.info.first_detected}</Typography>
                  </Box>
                  <Box sx={{ width: 'calc(50% - 8px)' }}>
                    <Typography variant="body2" color="text.secondary">最后检测时间:</Typography>
                    <Typography variant="body1">{data.wash_trade_check.info.last_detected}</Typography>
                  </Box>
                </Box>
              </Box>
            )}
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ mb: 3 }}>
              <GradientText variant="h6" gutterBottom>
                贷款建议
              </GradientText>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ width: 'calc(33.33% - 8px)' }}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        风险评级
                      </Typography>
                      <Chip 
                        label={data.recommendation.lending_risk === 'high' ? "高风险" : "正常"} 
                        color={data.recommendation.lending_risk === 'high' ? "error" : "success"}
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                  </Card>
                </Box>
                
                <Box sx={{ width: 'calc(33.33% - 8px)' }}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        最大贷款额度
                      </Typography>
                      <Chip 
                        label={`${Math.round(data.recommendation.max_loan_amount_factor * 100)}%`}
                        color="primary"
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                  </Card>
                </Box>
                
                <Box sx={{ width: 'calc(33.33% - 8px)' }}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        利率增加
                      </Typography>
                      <Chip 
                        label={`+${data.recommendation.interest_rate_increase.toFixed(2)}%`}
                        color="warning"
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                  </Card>
                </Box>
              </Box>
              
              <Alert severity="info" sx={{ mt: 2 }}>
                {data.recommendation.lending_risk === 'high' 
                  ? "由于该地址参与了对敲交易，建议提高贷款审核标准，降低贷款额度，并适当提高利率。" 
                  : "该地址未参与对敲交易，可以按照标准流程处理贷款申请。"}
              </Alert>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              {data.wash_trade_check.detected ? (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleRemoveFromBlacklist}
                  disabled={isRemoving}
                  startIcon={isRemoving ? <CircularProgress size={20} /> : undefined}
                >
                  从黑名单中移除
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={handleAddToBlacklist}
                  disabled={isAdding}
                  startIcon={isAdding ? <CircularProgress size={20} /> : undefined}
                >
                  添加到黑名单
                </Button>
              )}
              
              <Button
                variant="contained"
                color="primary"
                onClick={() => window.open(`http://localhost:5001/search?address=${address}&token=${token}`, '_blank')}
              >
                查看Dusko详细报告
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </GlassCard>
  );
};

export default WashTradeCheck;
