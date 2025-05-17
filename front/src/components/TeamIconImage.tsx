import React from 'react';
import { Box, BoxProps, useTheme } from '@mui/material';

interface TeamIconImageProps extends BoxProps {
  size?: number | string;
  color?: string;
  fontSize?: string;
}

// 使用实际队徽图片的图标组件
export const TeamIconImage: React.FC<TeamIconImageProps> = ({ 
  size = 24, 
  color, 
  fontSize, 
  sx, 
  ...props 
}) => {
  const theme = useTheme();
  // 根据fontSize属性调整大小
  let finalSize = size;
  if (fontSize === 'small') finalSize = 20;
  if (fontSize === 'medium') finalSize = 24;
  if (fontSize === 'large') finalSize = 35;
  if (fontSize === 'inherit') finalSize = 'inherit';
  
  return (
    <Box
      component="img"
      src="/icon.jpg"
      alt="队徽"
      sx={{
        width: finalSize,
        height: finalSize,
        objectFit: 'contain',
        display: 'inline-block',
        verticalAlign: 'middle',
        borderRadius: '50%',
        filter: color ? `drop-shadow(0 0 1px ${typeof color === 'string' ? color : theme.palette.primary.main})` : 'none',
        ...sx
      }}
      {...props}
    />
  );
};

export default TeamIconImage;
