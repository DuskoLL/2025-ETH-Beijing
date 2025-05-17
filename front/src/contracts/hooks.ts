// 导入模拟hooks，替代wagmi hooks
import {
  useAccount,
  useContracts,
  useLending,
  useTokens,
  useBlacklist
} from './mockHooks';

// 导出这些hooks供应用使用
export { useAccount, useContracts, useLending, useTokens, useBlacklist };
