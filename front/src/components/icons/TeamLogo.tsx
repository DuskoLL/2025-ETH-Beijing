import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

const TeamLogo: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M12 2L1 21h22L12 2zm0 4.2L18.6 19H5.4L12 6.2zm-1 3.8v4h2v-4h-2zm0 6v2h2v-2h-2z" />
    </SvgIcon>
  );
};

export default TeamLogo;
