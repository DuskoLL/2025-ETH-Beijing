import { useState, useEffect } from 'react';
import axios from 'axios';

// 黑名单地址列表
let blacklistedAddresses: string[] = [];
// 上次更新时间
let lastUpdateTime: number = 0;
// 更新间隔（7天，单位：毫秒）
const UPDATE_INTERVAL = 7 * 24 * 60 * 60 * 1000;

/**
 * 从文件加载黑名单地址
 */
const loadBlacklistedAddresses = async (): Promise<string[]> => {
  try {
    // 在实际生产环境中，这应该是从API获取黑名单
    // 这里我们模拟从本地文件获取
    const response = await axios.get('/blacklist/wash_trade_addresses.txt');
    const data = response.data as string;
    const addresses = data
      .split('\n')
      .filter((address: string) => address.trim() !== '')
      .map((address: string) => address.toLowerCase());
    
    console.log(`已加载 ${addresses.length} 个黑名单地址`);
    return addresses;
  } catch (error) {
    console.error('加载黑名单地址失败:', error);
    return [];
  }
};

/**
 * 初始化黑名单服务
 */
export const initBlacklistService = async (): Promise<void> => {
  blacklistedAddresses = await loadBlacklistedAddresses();
  lastUpdateTime = Date.now();
};

/**
 * 检查地址是否在黑名单中
 * @param address 要检查的地址
 * @returns 如果地址在黑名单中返回true，否则返回false
 */
export const isBlacklisted = (address: string): boolean => {
  // 检查是否需要更新黑名单
  const now = Date.now();
  if (now - lastUpdateTime > UPDATE_INTERVAL) {
    // 异步更新黑名单，不阻塞当前检查
    loadBlacklistedAddresses().then(addresses => {
      blacklistedAddresses = addresses;
      lastUpdateTime = now;
    });
  }

  // 转换为小写进行比较
  return blacklistedAddresses.includes(address.toLowerCase());
};

/**
 * 黑名单Hook，用于在React组件中检查地址
 */
export const useBlacklist = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [initialized, setInitialized] = useState<boolean>(false);

  // 初始化黑名单
  useEffect(() => {
    if (!initialized) {
      setLoading(true);
      initBlacklistService()
        .then(() => {
          setInitialized(true);
          setLoading(false);
        })
        .catch(error => {
          console.error('初始化黑名单服务失败:', error);
          setLoading(false);
        });
    }
  }, [initialized]);

  /**
   * 检查地址是否在黑名单中
   */
  const checkAddress = (address: string): boolean => {
    if (!address) return false;
    return isBlacklisted(address);
  };

  return {
    loading,
    initialized,
    checkAddress
  };
};

export default {
  initBlacklistService,
  isBlacklisted,
  useBlacklist
};
