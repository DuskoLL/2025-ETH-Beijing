import React from 'react';
import { styled, Box, Card, Paper, alpha, keyframes } from '@mui/material';

// 动画效果
const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0, 255, 138, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(0, 255, 138, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 255, 138, 0); }
`;

const glow = keyframes`
  0% { filter: drop-shadow(0 0 2px rgba(0, 255, 138, 0.7)); }
  50% { filter: drop-shadow(0 0 5px rgba(0, 255, 138, 0.9)); }
  100% { filter: drop-shadow(0 0 2px rgba(0, 255, 138, 0.7)); }
`;

const scanLine = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

// 科技风格卡片
export const TechCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.7)} 100%)`,
  backdropFilter: 'blur(10px)',
  borderRadius: '12px',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  boxShadow: `0 4px 20px rgba(0, 0, 0, 0.5), 0 0 0 1px ${alpha(theme.palette.primary.main, 0.1)} inset`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, transparent)`,
    zIndex: 1,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `linear-gradient(to bottom, ${alpha(theme.palette.primary.main, 0.05)} 0%, transparent 100%)`,
    pointerEvents: 'none',
  },
  '&:hover': {
    boxShadow: `0 8px 32px rgba(0, 0, 0, 0.7), 0 0 0 1px ${alpha(theme.palette.primary.main, 0.3)} inset`,
  }
}));

// 数据展示卡片
export const DataCard = styled(TechCard)(({ theme }) => ({
  padding: theme.spacing(2),
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '3px',
    background: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  }
}));

// 科技风格面板
export const TechPanel = styled(Paper)(({ theme }) => ({
  background: alpha(theme.palette.background.paper, 0.7),
  backdropFilter: 'blur(10px)',
  borderRadius: '8px',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  padding: theme.spacing(2),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `radial-gradient(circle at 50% 50%, ${alpha(theme.palette.primary.main, 0.1)}, transparent 70%)`,
    pointerEvents: 'none',
  }
}));

// 发光边框容器
export const GlowingBorder = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: '8px',
  padding: '1px',
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  animation: `${glow} 2s infinite ease-in-out`,
}));

// 科技风格按钮容器
export const TechButtonContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: '4px',
  padding: theme.spacing(0.5),
  background: alpha(theme.palette.background.paper, 0.8),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
  '&:hover': {
    background: alpha(theme.palette.background.paper, 0.9),
    boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.5)}`,
  }
}));

// 数据网格容器
export const DataGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: theme.spacing(2),
  width: '100%',
}));

// 科技风格背景
export const TechBackground = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: `radial-gradient(circle at 50% 50%, ${alpha(theme.palette.primary.main, 0.05)}, transparent 70%)`,
  zIndex: -1,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0z' fill='none'/%3E%3Cpath d='M0 0h1v1H0zM5 5h1v1H5zM10 10h1v1h-1zM15 15h1v1h-1z' fill='${encodeURIComponent(theme.palette.primary.main)}' fill-opacity='0.1'/%3E%3C/svg%3E")`,
    opacity: 0.1,
  }
}));

// 脉冲动画容器
export const PulseContainer = styled(Box)(({ theme }) => ({
  animation: `${pulse} 2s infinite`,
}));

// 扫描线效果
export const ScanEffect = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '10px',
    background: `linear-gradient(to bottom, ${alpha(theme.palette.primary.main, 0.3)}, transparent)`,
    animation: `${scanLine} 2s linear infinite`,
    zIndex: 1,
  }
}));

// 霓虹文字
export const NeonText = styled(Box)(({ theme }) => ({
  color: theme.palette.primary.main,
  textShadow: `0 0 5px ${theme.palette.primary.main}, 0 0 10px ${theme.palette.primary.main}, 0 0 15px ${theme.palette.primary.main}`,
}));

// 数据指示器
export const DataIndicator = styled(Box)(({ theme }) => ({
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  background: theme.palette.primary.main,
  boxShadow: `0 0 10px ${theme.palette.primary.main}`,
  animation: `${pulse} 2s infinite`,
}));

export default {
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
};
