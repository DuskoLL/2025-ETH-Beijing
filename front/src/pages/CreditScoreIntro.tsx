import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  GridLegacy as Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { TechBackground } from '../components/TechStyles';

const CreditScoreIntro: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

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
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom
              sx={{
                fontWeight: 700,
                color: '#fff',
                textShadow: `0 0 10px ${theme.palette.primary.main}`,
                mb: 3,
              }}
            >
              AI信用评分系统
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#fff', 
                opacity: 0.9, 
                mb: 5,
                maxWidth: '800px'
              }}
            >
              我们的AI信用评分系统基于区块链数据和用户行为，为每位用户提供公正、透明的信用评分，
              帮助用户在去中心化金融世界中建立可信的信用记录。
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                height: '100%',
                background: alpha(theme.palette.background.paper, 0.1),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                borderRadius: 2,
              }}
            >
              <Typography 
                variant="h5" 
                component="h2" 
                gutterBottom
                sx={{ 
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  mb: 3,
                }}
              >
                评分因素
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutlineIcon sx={{ color: theme.palette.primary.main }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="链上交易历史" 
                    secondary="分析用户的交易频率、金额和类型" 
                    primaryTypographyProps={{ color: '#fff' }}
                    secondaryTypographyProps={{ color: alpha('#fff', 0.7) }}
                  />
                </ListItem>
                <Divider sx={{ my: 1, backgroundColor: alpha('#fff', 0.1) }} />
                
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutlineIcon sx={{ color: theme.palette.primary.main }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="借贷历史" 
                    secondary="评估用户的借贷行为和还款记录" 
                    primaryTypographyProps={{ color: '#fff' }}
                    secondaryTypographyProps={{ color: alpha('#fff', 0.7) }}
                  />
                </ListItem>
                <Divider sx={{ my: 1, backgroundColor: alpha('#fff', 0.1) }} />
                
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutlineIcon sx={{ color: theme.palette.primary.main }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="资产持有情况" 
                    secondary="考虑用户的资产多样性和持有时间" 
                    primaryTypographyProps={{ color: '#fff' }}
                    secondaryTypographyProps={{ color: alpha('#fff', 0.7) }}
                  />
                </ListItem>
                <Divider sx={{ my: 1, backgroundColor: alpha('#fff', 0.1) }} />
                
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutlineIcon sx={{ color: theme.palette.primary.main }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="DeFi参与度" 
                    secondary="评估用户在DeFi生态系统中的活跃程度" 
                    primaryTypographyProps={{ color: '#fff' }}
                    secondaryTypographyProps={{ color: alpha('#fff', 0.7) }}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                height: '100%',
                background: alpha(theme.palette.background.paper, 0.1),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                borderRadius: 2,
              }}
            >
              <Typography 
                variant="h5" 
                component="h2" 
                gutterBottom
                sx={{ 
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  mb: 3,
                }}
              >
                系统优势
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <TrendingUpIcon sx={{ color: theme.palette.primary.main }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="AI驱动" 
                    secondary="使用先进的机器学习算法分析用户行为，提供精准评分" 
                    primaryTypographyProps={{ color: '#fff' }}
                    secondaryTypographyProps={{ color: alpha('#fff', 0.7) }}
                  />
                </ListItem>
                <Divider sx={{ my: 1, backgroundColor: alpha('#fff', 0.1) }} />
                
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon sx={{ color: theme.palette.primary.main }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="去中心化" 
                    secondary="评分过程完全在链上进行，无需中心化机构参与" 
                    primaryTypographyProps={{ color: '#fff' }}
                    secondaryTypographyProps={{ color: alpha('#fff', 0.7) }}
                  />
                </ListItem>
                <Divider sx={{ my: 1, backgroundColor: alpha('#fff', 0.1) }} />
                
                <ListItem>
                  <ListItemIcon>
                    <VerifiedUserIcon sx={{ color: theme.palette.primary.main }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="透明可信" 
                    secondary="评分标准公开透明，用户可随时查看自己的评分详情" 
                    primaryTypographyProps={{ color: '#fff' }}
                    secondaryTypographyProps={{ color: alpha('#fff', 0.7) }}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              sx={{ 
                mt: 3, 
                mb: 2,
                py: 1.5,
                px: 4,
                borderRadius: 2,
                background: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                '&:hover': {
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                  boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.5)}`
                }
              }}
              onClick={() => navigate('/credit-score')}
            >
              查询我的信用分
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              sx={{ 
                mt: 3, 
                mb: 2,
                ml: 2,
                py: 1.5,
                px: 4,
                borderRadius: 2,
                borderColor: theme.palette.primary.main,
                color: '#fff',
                '&:hover': {
                  borderColor: theme.palette.primary.light,
                  background: alpha(theme.palette.primary.main, 0.1),
                }
              }}
              onClick={() => navigate('/')}
            >
              返回首页
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CreditScoreIntro;
