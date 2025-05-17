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
import ShieldIcon from '@mui/icons-material/Shield';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SpeedIcon from '@mui/icons-material/Speed';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import { TechBackground } from '../components/TechStyles';

const RiskControlIntro: React.FC = () => {
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
                textShadow: `0 0 10px ${theme.palette.secondary.main}`,
                mb: 3,
              }}
            >
              智能风控系统
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
              我们的智能风控系统采用先进的AI算法，实时监控链上交易行为，
              识别异常交易模式，为用户提供安全可靠的借贷环境。
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
                border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                borderRadius: 2,
              }}
            >
              <Typography 
                variant="h5" 
                component="h2" 
                gutterBottom
                sx={{ 
                  color: theme.palette.secondary.main,
                  fontWeight: 600,
                  mb: 3,
                }}
              >
                风控功能
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <ShieldIcon sx={{ color: theme.palette.secondary.main }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="异常交易检测" 
                    secondary="实时监控并识别可疑交易行为，防范潜在风险" 
                    primaryTypographyProps={{ color: '#fff' }}
                    secondaryTypographyProps={{ color: alpha('#fff', 0.7) }}
                  />
                </ListItem>
                <Divider sx={{ my: 1, backgroundColor: alpha('#fff', 0.1) }} />
                
                <ListItem>
                  <ListItemIcon>
                    <ShieldIcon sx={{ color: theme.palette.secondary.main }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="风险评估" 
                    secondary="对每笔借贷交易进行风险评估，确保系统安全" 
                    primaryTypographyProps={{ color: '#fff' }}
                    secondaryTypographyProps={{ color: alpha('#fff', 0.7) }}
                  />
                </ListItem>
                <Divider sx={{ my: 1, backgroundColor: alpha('#fff', 0.1) }} />
                
                <ListItem>
                  <ListItemIcon>
                    <ShieldIcon sx={{ color: theme.palette.secondary.main }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="智能黑名单" 
                    secondary="自动将高风险地址加入黑名单，保护系统安全" 
                    primaryTypographyProps={{ color: '#fff' }}
                    secondaryTypographyProps={{ color: alpha('#fff', 0.7) }}
                  />
                </ListItem>
                <Divider sx={{ my: 1, backgroundColor: alpha('#fff', 0.1) }} />
                
                <ListItem>
                  <ListItemIcon>
                    <ShieldIcon sx={{ color: theme.palette.secondary.main }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="风险预警" 
                    secondary="提前预测潜在风险，并向用户发出预警" 
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
                border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                borderRadius: 2,
              }}
            >
              <Typography 
                variant="h5" 
                component="h2" 
                gutterBottom
                sx={{ 
                  color: theme.palette.secondary.main,
                  fontWeight: 600,
                  mb: 3,
                }}
              >
                系统优势
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <SpeedIcon sx={{ color: theme.palette.secondary.main }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="实时监控" 
                    secondary="24/7不间断监控链上交易，及时发现风险" 
                    primaryTypographyProps={{ color: '#fff' }}
                    secondaryTypographyProps={{ color: alpha('#fff', 0.7) }}
                  />
                </ListItem>
                <Divider sx={{ my: 1, backgroundColor: alpha('#fff', 0.1) }} />
                
                <ListItem>
                  <ListItemIcon>
                    <VisibilityIcon sx={{ color: theme.palette.secondary.main }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="透明可查" 
                    secondary="风控规则公开透明，用户可查看风控评估结果" 
                    primaryTypographyProps={{ color: '#fff' }}
                    secondaryTypographyProps={{ color: alpha('#fff', 0.7) }}
                  />
                </ListItem>
                <Divider sx={{ my: 1, backgroundColor: alpha('#fff', 0.1) }} />
                
                <ListItem>
                  <ListItemIcon>
                    <AutoGraphIcon sx={{ color: theme.palette.secondary.main }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="自适应学习" 
                    secondary="系统不断从新数据中学习，持续优化风控模型" 
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
              color="secondary"
              sx={{ 
                mt: 3, 
                mb: 2,
                py: 1.5,
                px: 4,
                borderRadius: 2,
                background: `linear-gradient(90deg, ${theme.palette.secondary.dark}, ${theme.palette.secondary.main})`,
                '&:hover': {
                  background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.light})`,
                  boxShadow: `0 0 15px ${alpha(theme.palette.secondary.main, 0.5)}`
                }
              }}
              onClick={() => navigate('/dashboard')}
            >
              查看风控面板
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              color="secondary"
              sx={{ 
                mt: 3, 
                mb: 2,
                ml: 2,
                py: 1.5,
                px: 4,
                borderRadius: 2,
                borderColor: theme.palette.secondary.main,
                color: '#fff',
                '&:hover': {
                  borderColor: theme.palette.secondary.light,
                  background: alpha(theme.palette.secondary.main, 0.1),
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

export default RiskControlIntro;
