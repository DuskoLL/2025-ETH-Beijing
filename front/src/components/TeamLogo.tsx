import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

// 队徽图标组件
export const TeamLogo: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      {/* 这里是一个简单的队徽SVG图形，您可以替换为实际的队徽SVG路径 */}
      <path 
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" 
        fill="currentColor"
      />
      <path 
        d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" 
        fill="currentColor"
      />
      <path 
        d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" 
        fill="currentColor"
      />
    </SvgIcon>
  );
};

// 不同尺寸和用途的队徽变体
export const TeamLogoSmall: React.FC<SvgIconProps> = (props) => {
  return <TeamLogo fontSize="small" {...props} />;
};

export const TeamLogoMedium: React.FC<SvgIconProps> = (props) => {
  return <TeamLogo fontSize="medium" {...props} />;
};

export const TeamLogoLarge: React.FC<SvgIconProps> = (props) => {
  return <TeamLogo fontSize="large" {...props} />;
};

export default TeamLogo;
