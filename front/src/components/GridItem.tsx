import React from 'react';
import { Grid, GridProps } from '@mui/material';

// 这是一个包装组件，用于解决 Material UI v7 中 Grid 组件的 API 变化问题
export const GridItem: React.FC<GridProps> = (props) => {
  return <Grid {...props} />;
};

export default GridItem;
