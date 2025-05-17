import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

// 队徽图标组件 - 更精细的设计
export const TeamLogo: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      {/* 这里是一个更精细的队徽SVG图形，您可以替换为实际的队徽SVG路径 */}
      <path 
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" 
        fill="currentColor"
        opacity="0.8"
      />
      <path 
        d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" 
        fill="currentColor"
        opacity="0.9"
      />
      <path 
        d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" 
        fill="currentColor"
      />
      {/* 添加一些装饰元素 */}
      <path 
        d="M12 7.5l1 1.5-1 1.5-1-1.5z" 
        fill="currentColor"
      />
      <path 
        d="M12 13.5l1 1.5-1 1.5-1-1.5z" 
        fill="currentColor"
      />
      <path 
        d="M7.5 12l1.5 1-1.5 1-1.5-1z" 
        fill="currentColor"
      />
      <path 
        d="M16.5 12l-1.5 1 1.5 1 1.5-1z" 
        fill="currentColor"
      />
    </SvgIcon>
  );
};

// 不同用途的队徽变体
export const MoneyTeamIcon: React.FC<SvgIconProps> = (props) => {
  return <TeamLogo {...props} />;
};

export const CreditTeamIcon: React.FC<SvgIconProps> = (props) => {
  return <TeamLogo {...props} />;
};

export const CalendarTeamIcon: React.FC<SvgIconProps> = (props) => {
  return <TeamLogo {...props} />;
};

export const ReceiptTeamIcon: React.FC<SvgIconProps> = (props) => {
  return <TeamLogo {...props} />;
};

export const InfoTeamIcon: React.FC<SvgIconProps> = (props) => {
  return <TeamLogo {...props} />;
};

export const ArrowBackTeamIcon: React.FC<SvgIconProps> = (props) => {
  return <TeamLogo {...props} />;
};

export const ArrowForwardTeamIcon: React.FC<SvgIconProps> = (props) => {
  return <TeamLogo {...props} />;
};

export const CheckCircleTeamIcon: React.FC<SvgIconProps> = (props) => {
  return <TeamLogo {...props} />;
};

export const LocalAtmTeamIcon: React.FC<SvgIconProps> = (props) => {
  return <TeamLogo {...props} />;
};

export const PercentTeamIcon: React.FC<SvgIconProps> = (props) => {
  return <TeamLogo {...props} />;
};

export const TimerTeamIcon: React.FC<SvgIconProps> = (props) => {
  return <TeamLogo {...props} />;
};

export const TrendingUpTeamIcon: React.FC<SvgIconProps> = (props) => {
  return <TeamLogo {...props} />;
};

export const SecurityTeamIcon: React.FC<SvgIconProps> = (props) => {
  return <TeamLogo {...props} />;
};

export const AssessmentTeamIcon: React.FC<SvgIconProps> = (props) => {
  return <TeamLogo {...props} />;
};

export const WalletTeamIcon: React.FC<SvgIconProps> = (props) => {
  return <TeamLogo {...props} />;
};

export const AddTeamIcon: React.FC<SvgIconProps> = (props) => {
  return <TeamLogo {...props} />;
};

export const RemoveTeamIcon: React.FC<SvgIconProps> = (props) => {
  return <TeamLogo {...props} />;
};

export const SwapTeamIcon: React.FC<SvgIconProps> = (props) => {
  return <TeamLogo {...props} />;
};

export const RefreshTeamIcon: React.FC<SvgIconProps> = (props) => {
  return <TeamLogo {...props} />;
};

export const TimelineTeamIcon: React.FC<SvgIconProps> = (props) => {
  return <TeamLogo {...props} />;
};

export default TeamLogo;
