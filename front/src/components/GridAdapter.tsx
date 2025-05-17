import React from 'react';
import { GridLegacy, Grid as MuiGrid } from '@mui/material';

// 这是一个适配器组件，用于处理 Material UI v7 中 Grid 组件的 API 变化
// 在 v7 中，旧的 Grid 组件被重命名为 GridLegacy，而之前的 Grid2 现在成为了新的 Grid 组件

// 使用新的 Grid 组件，它不需要 item 属性，直接使用 xs, sm, md, lg, xl 属性
export const Grid = MuiGrid;

// 使用旧的 GridLegacy 组件，它需要 item 属性
export const LegacyGrid = GridLegacy;

export default Grid;
