import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Stack,
  Grid,
  useTheme,
  alpha,
  Fade,
} from '@mui/material';
import { keyframes } from '@mui/system';
import { TechBackground, NeonText, PulseContainer } from '../components/TechStyles';
import TeamIconImage from '../components/TeamIconImage';

// 定义动画效果
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const Home: React.FC = () => {
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
        <Fade in={true} timeout={800}>
          <Box>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <PulseContainer>
                <TeamIconImage size={120} color="primary" sx={{ mb: 3 }} />
              </PulseContainer>
              
              <NeonText>
                <Typography 
                  variant="h2" 
                  component="h1" 
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    textAlign: 'center',
                    mb: 3,
                    color: '#fff',
                    textShadow: `0 0 10px ${theme.palette.primary.main}`,
                    animation: `${fadeIn} 1s ease-out`,
                  }}
                >
                  AI信用评分借贷协议
                </Typography>
              </NeonText>
              
              <Typography 
                variant="h6" 
                paragraph
                sx={{
                  textAlign: 'center',
                  maxWidth: '800px',
                  mx: 'auto',
                  mb: 5,
                  animation: `${fadeIn} 1s ease-out 0.3s both`,
                  opacity: 0,
                  color: '#fff',
                }}
              >
                基于区块链技术的去中心化信用评分和借贷平台，为您提供透明、安全、高效的金融服务
              </Typography>
              
              <Button
                variant="contained"
                size="large"
                sx={{ 
                  mt: 3, 
                  mb: 2,
                  py: 1.5,
                  px: 4,
                  borderRadius: 2,
                  position: 'relative',
                  overflow: 'hidden',
                  background: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                  '&:hover': {
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                    boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.5)}`
                  }
                }}
                onClick={() => navigate('/lending')}
              >
                开始借贷
              </Button>
            </Box>

            <Stack 
              direction="row" 
              spacing={4} 
              sx={{ 
                flexWrap: 'wrap', 
                justifyContent: 'center',
                '& > *': {
                  animation: `${fadeIn} 0.8s ease-out 0.7s both`,
                  opacity: 0,
                },
                '& > *:nth-of-type(2)': {
                  animation: `${fadeIn} 0.8s ease-out 0.9s both`,
                },
                '& > *:nth-of-type(3)': {
                  animation: `${fadeIn} 0.8s ease-out 1.1s both`,
                },
              }}
            >
              {/* 信用评分卡片 */}
              <Box sx={{ width: { xs: '100%', md: '30%' }, mb: 4 }}>
                <Card sx={{ 
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: `0 20px 30px rgba(0, 0, 0, 0.3), 
                           0 0 30px ${alpha(theme.palette.primary.main, 0.3)}`,
                  },
                }}>
                  <Box sx={{ 
                    height: '160px', 
                    background: 'linear-gradient(135deg, #3a7bd5 0%, #00d4ff 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'url("/credit-score.jpg")',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      opacity: 0.6,
                      mixBlendMode: 'overlay',
                    }
                  }}>
                    <Box sx={{ 
                      position: 'absolute', 
                      bottom: 0, 
                      left: 0, 
                      right: 0,
                      height: '50%',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                      zIndex: 1,
                    }} />
                  </Box>
                  <CardContent sx={{ position: 'relative', pt: 3 }}>
                    <Typography 
                      variant="h5" 
                      component="div" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 600,
                        color: '#fff',
                        textShadow: `0 0 5px ${theme.palette.primary.main}`,
                      }}
                    >
                      AI信用评分
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: '#fff', opacity: 0.8 }}>
                      基于链上行为的智能信用评分系统，帮助您建立可信的信用记录。
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ px: 2, pb: 2 }}>
                    <Button 
                      size="medium" 
                      color="primary"
                      onClick={() => navigate('/credit-score')}
                      sx={{ 
                        borderRadius: '20px',
                        px: 2,
                        '&:hover': {
                          background: alpha(theme.palette.primary.main, 0.1),
                        }
                      }}
                    >
                      查询信用分
                    </Button>
                  </CardActions>
                </Card>
              </Box>

              {/* 风控检测卡片 */}
              <Box sx={{ width: { xs: '100%', md: '30%' }, mb: 4 }}>
                <Card sx={{ 
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: `0 20px 30px rgba(0, 0, 0, 0.3), 
                           0 0 30px ${alpha(theme.palette.secondary.main, 0.3)}`,
                  },
                }}>
                  <Box sx={{ 
                    height: '160px', 
                    background: 'linear-gradient(135deg, #00d4ff 0%, #00e676 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'url("/risk-control.jpg")',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      opacity: 0.6,
                      mixBlendMode: 'overlay',
                    }
                  }}>
                    <Box sx={{ 
                      position: 'absolute', 
                      bottom: 0, 
                      left: 0, 
                      right: 0,
                      height: '50%',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                      zIndex: 1,
                    }} />
                  </Box>
                  <CardContent sx={{ position: 'relative', pt: 3 }}>
                    <Typography 
                      variant="h5" 
                      component="div" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 600,
                        color: '#fff',
                        textShadow: `0 0 5px ${theme.palette.secondary.main}`,
                      }}
                    >
                      风控检测
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: '#fff', opacity: 0.8 }}>
                      智能风控系统，实时监控交易行为，保障资金安全。
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ px: 2, pb: 2 }}>
                    <Button 
                      size="medium" 
                      color="secondary"
                      onClick={() => navigate('/dashboard')}
                      sx={{ 
                        borderRadius: '20px',
                        px: 2,
                        '&:hover': {
                          background: alpha(theme.palette.secondary.main, 0.1),
                        }
                      }}
                    >
                      了解更多
                    </Button>
                  </CardActions>
                </Card>
              </Box>

              {/* 双代币模型卡片 */}
              <Box sx={{ width: { xs: '100%', md: '30%' }, mb: 4 }}>
                <Card sx={{ 
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: `0 20px 30px rgba(0, 0, 0, 0.3), 
                           0 0 30px ${alpha(theme.palette.warning.main, 0.3)}`,
                  },
                }}>
                  <Box sx={{ 
                    height: '160px', 
                    background: 'linear-gradient(135deg, #ffab00 0%, #ff5252 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'url("/dual-token.jpg")',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      opacity: 0.6,
                      mixBlendMode: 'overlay',
                    }
                  }}>
                    <Box sx={{ 
                      position: 'absolute', 
                      bottom: 0, 
                      left: 0, 
                      right: 0,
                      height: '50%',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                      zIndex: 1,
                    }} />
                  </Box>
                  <CardContent sx={{ position: 'relative', pt: 3 }}>
                    <Typography 
                      variant="h5" 
                      component="div" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 600,
                        color: '#fff',
                        textShadow: `0 0 5px ${theme.palette.warning.main}`,
                      }}
                    >
                      双代币模型
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: '#fff', opacity: 0.8 }}>
                      创新的双代币经济模型，平衡治理与流动性。
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ px: 2, pb: 2 }}>
                    <Button 
                      size="medium" 
                      color="warning"
                      onClick={() => navigate('/dashboard')}
                      sx={{ 
                        borderRadius: '20px',
                        px: 2,
                        '&:hover': {
                          background: alpha(theme.palette.warning.main, 0.1),
                        }
                      }}
                    >
                      了解更多
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            </Stack>
            
            {/* 平台特点部分 */}
            <Box sx={{ mt: 10, mb: 6 }}>
              <Typography 
                variant="h3" 
                component="h2" 
                sx={{ 
                  textAlign: 'center', 
                  mb: 6,
                  color: '#fff',
                  fontWeight: 700,
                  textShadow: `0 0 10px ${theme.palette.primary.main}`,
                }}
              >
                平台特点
              </Typography>
              
              <Grid container spacing={4}>
                {/* 特点一：去中心化 */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 3,
                    height: '100%',
                    background: alpha(theme.palette.background.paper, 0.4),
                    backdropFilter: 'blur(10px)',
                    borderRadius: theme.shape.borderRadius * 2,
                    transition: 'all 0.3s ease',
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: `0 10px 20px rgba(0, 0, 0, 0.2), 0 0 15px ${alpha(theme.palette.primary.main, 0.3)}`,
                      background: alpha(theme.palette.background.paper, 0.6),
                    }
                  }}>
                    <Box sx={{ 
                      width: 80, 
                      height: 80, 
                      borderRadius: '50%', 
                      background: alpha(theme.palette.primary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                      color: theme.palette.primary.main,
                    }}>
                      <TeamIconImage size={40} color="primary" />
                    </Box>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600, color: '#fff' }}>
                      去中心化架构
                    </Typography>
                    <Typography sx={{ color: '#fff', opacity: 0.8 }}>
                      基于区块链技术构建的完全去中心化系统，无需信任第三方，保障数据安全和交易透明。
                    </Typography>
                  </Box>
                </Grid>
                
                {/* 特点二：AI驱动 */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 3,
                    height: '100%',
                    background: alpha(theme.palette.background.paper, 0.4),
                    backdropFilter: 'blur(10px)',
                    borderRadius: theme.shape.borderRadius * 2,
                    transition: 'all 0.3s ease',
                    border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: `0 10px 20px rgba(0, 0, 0, 0.2), 0 0 15px ${alpha(theme.palette.secondary.main, 0.3)}`,
                      background: alpha(theme.palette.background.paper, 0.6),
                    }
                  }}>
                    <Box sx={{ 
                      width: 80, 
                      height: 80, 
                      borderRadius: '50%', 
                      background: alpha(theme.palette.secondary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                      color: theme.palette.secondary.main,
                    }}>
                      <TeamIconImage size={40} color="secondary" />
                    </Box>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600, color: '#fff' }}>
                      AI智能评分
                    </Typography>
                    <Typography sx={{ color: '#fff', opacity: 0.8 }}>
                      采用先进的人工智能算法，分析链上行为和交易历史，提供精准的信用评分和风险预测。
                    </Typography>
                  </Box>
                </Grid>
                
                {/* 特点三：安全保障 */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 3,
                    height: '100%',
                    background: alpha(theme.palette.background.paper, 0.4),
                    backdropFilter: 'blur(10px)',
                    borderRadius: theme.shape.borderRadius * 2,
                    transition: 'all 0.3s ease',
                    border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: `0 10px 20px rgba(0, 0, 0, 0.2), 0 0 15px ${alpha(theme.palette.warning.main, 0.3)}`,
                      background: alpha(theme.palette.background.paper, 0.6),
                    }
                  }}>
                    <Box sx={{ 
                      width: 80, 
                      height: 80, 
                      borderRadius: '50%', 
                      background: alpha(theme.palette.warning.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                      color: theme.palette.warning.main,
                    }}>
                      <TeamIconImage size={40} color="warning" />
                    </Box>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600, color: '#fff' }}>
                      多重安全保障
                    </Typography>
                    <Typography sx={{ color: '#fff', opacity: 0.8 }}>
                      智能合约审计、实时风控监测和多签名钱包技术，全方位保障用户资产安全和交易安全。
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Home;
