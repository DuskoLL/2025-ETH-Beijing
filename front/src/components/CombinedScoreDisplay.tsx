import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Grid,
  Divider,
  Chip,
  Button,
  Alert,
  LinearProgress,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useGetCombinedScoreQuery } from '../services/combinedScoreService';
import TechStyles from './TechStyles';

// 创建组件别名以便使用
const GlassCard = ({ children, sx }: any) => <TechStyles.TechCard sx={sx}>{children}</TechStyles.TechCard>;
const GradientText = ({ children, variant, sx }: any) => <Typography variant={variant || "h4"} sx={{ ...sx, color: "primary.main", textShadow: "0 0 5px #00ff8a, 0 0 10px #00ff8a" }}>{children}</Typography>;

// 创建AnimatedNumber组件
const AnimatedNumber = ({ value }: { value: number }) => {
  return <>{Math.round(value)}</>;
};

// 风险等级对应的颜色
const riskColors = {
  low: '#4caf50',
  medium: '#ff9800',
  high: '#f44336',
  very_high: '#9c27b0'
};

// 风险等级对应的中文
const riskLevelText = {
  low: '低风险',
  medium: '中等风险',
  high: '高风险',
  very_high: '极高风险'
};

// 特征重要性进度条
const FeatureProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
}));

// 评分圆环组件
const ScoreCircle = ({ score, size = 150, thickness = 5, label = '综合评分' }) => {
  const theme = useTheme();
  const normalizedScore = Math.min(100, Math.max(0, score));
  
  // 根据分数计算颜色
  const getColor = (score: number) => {
    if (score >= 80) return '#4caf50';
    if (score >= 60) return '#ff9800';
    if (score >= 40) return '#f44336';
    return '#9c27b0';
  };
  
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={normalizedScore}
        size={size}
        thickness={thickness}
        sx={{ color: getColor(normalizedScore) }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column'
        }}
      >
        <Typography variant="h4" component="div" color="text.primary">
          <AnimatedNumber value={normalizedScore} />
        </Typography>
        <Typography variant="caption" component="div" color="text.secondary">
          {label}
        </Typography>
      </Box>
    </Box>
  );
};

interface CombinedScoreDisplayProps {
  address: string;
  token: string;
}

const CombinedScoreDisplay: React.FC<CombinedScoreDisplayProps> = ({ address, token }) => {
  const { data, error, isLoading, refetch } = useGetCombinedScoreQuery(address);
  
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
        获取综合评分失败：{(error as any).error || '未知错误'}
        <Button onClick={() => refetch()} sx={{ ml: 2 }}>重试</Button>
      </Alert>
    );
  }
  
  if (!data) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        暂无评分数据
        <Button onClick={() => refetch()} sx={{ ml: 2 }}>重新获取</Button>
      </Alert>
    );
  }
  
  return (
    <Box sx={{ mt: 2 }}>
      <GradientText variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        综合信用评分
      </GradientText>
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* 左侧：评分圆环和风险等级 */}
        <Box sx={{ width: { xs: '100%', md: '33%' } }}>
          <GlassCard>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
              <ScoreCircle score={data.combinedScore} />
              
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Chip 
                  label={riskLevelText[data.riskLevel]} 
                  sx={{ 
                    bgcolor: riskColors[data.riskLevel],
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    py: 2,
                    px: 1
                  }} 
                />
              </Box>
            </Box>
          </GlassCard>
        </Box>
        
        {/* 右侧：评分详情 */}
        <Box sx={{ width: { xs: '100%', md: '67%' } }}>
          <GlassCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                评分详情
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  基础评分
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <FeatureProgress variant="determinate" value={data.scoreComponents.baseScore} 
                      sx={{ bgcolor: 'background.paper', '& .MuiLinearProgress-bar': { bgcolor: '#2196f3' } }} />
                  </Box>
                  <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="text.secondary">{data.scoreComponents.baseScore}</Typography>
                  </Box>
                </Box>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  对敲交易扣分
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <FeatureProgress variant="determinate" value={data.scoreComponents.washTradePenalty} 
                      sx={{ bgcolor: 'background.paper', '& .MuiLinearProgress-bar': { bgcolor: '#f44336' } }} />
                  </Box>
                  <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="text.secondary">-{data.scoreComponents.washTradePenalty}</Typography>
                  </Box>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  最终评分
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <FeatureProgress variant="determinate" value={data.scoreComponents.finalScore} 
                      sx={{ bgcolor: 'background.paper', '& .MuiLinearProgress-bar': { bgcolor: '#4caf50' } }} />
                  </Box>
                  <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="text.secondary">{data.scoreComponents.finalScore}</Typography>
                  </Box>
                </Box>
              </Box>
              
              <Alert severity="info" sx={{ mt: 2 }}>
                {data.explanation}
              </Alert>
            </CardContent>
          </GlassCard>
          
          {/* 贷款建议 */}
          <GlassCard sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                贷款建议
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ width: 'calc(50% - 8px)' }}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      推荐利率
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {data.recommendedInterestRate.toFixed(2)}%
                    </Typography>
                  </Paper>
                </Box>
                
                <Box sx={{ width: 'calc(50% - 8px)' }}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      最大贷款额度
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {data.maxLoanAmount.toFixed(2)} ETH
                    </Typography>
                  </Paper>
                </Box>
              </Box>
              
              {data.ethScore && data.ethScore.feature_importance && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    评分因素重要性
                  </Typography>
                  
                  {Object.entries(data.ethScore.feature_importance).map(([feature, importance]) => (
                    <Box key={feature} sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          {getFeatureLabel(feature)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {(Number(importance) * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                      <FeatureProgress 
                        variant="determinate" 
                        value={Number(importance) * 100} 
                        sx={{ 
                          bgcolor: 'background.paper',
                          '& .MuiLinearProgress-bar': { 
                            bgcolor: getFeatureColor(feature)
                          } 
                        }} 
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </GlassCard>
        </Box>
      </Box>
    </Box>
  );
};

// 特征名称转换为中文标签
const getFeatureLabel = (feature: string): string => {
  const labels: Record<string, string> = {
    balance_ether: 'ETH余额',
    balance_value: '账户价值',
    total_transactions: '总交易数',
    sent: '发送交易数',
    received: '接收交易数',
    n_contracts_sent: '合约交互发送',
    n_contracts_received: '合约交互接收'
  };
  
  return labels[feature] || feature;
};

// 为不同特征分配不同颜色
const getFeatureColor = (feature: string): string => {
  const colors: Record<string, string> = {
    balance_ether: '#3f51b5',
    balance_value: '#2196f3',
    total_transactions: '#00bcd4',
    sent: '#009688',
    received: '#4caf50',
    n_contracts_sent: '#ff9800',
    n_contracts_received: '#ff5722'
  };
  
  return colors[feature] || '#9e9e9e';
};

export default CombinedScoreDisplay;
