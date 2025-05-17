import { parseEther } from 'viem'
import { sepolia } from 'viem/chains'
import CoreLendingABI from './abi/CoreLending.json'
import { useAccount, useWriteContract } from 'wagmi'

// 智能合约地址 - 需要替换为实际部署的合约地址
const CORE_LENDING_ADDRESS = '0x123456789abcdef123456789abcdef123456789a' // 替换为实际部署的合约地址

// 合约交互服务 - 使用 React hooks
export const useContractService = () => {
  const { address, isConnected } = useAccount()
  const { writeContractAsync } = useWriteContract()

  // 无抵押借款
  const borrowWithoutCollateral = async (amount: string, duration: number) => {
    try {
      if (!isConnected || !address) throw new Error('钱包未连接')
      
      const amountInWei = parseEther(amount)
      
      // 发送交易
      const hash = await writeContractAsync({
        address: CORE_LENDING_ADDRESS as `0x${string}`,
        abi: CoreLendingABI,
        functionName: 'borrowWithoutCollateral',
        args: [amountInWei, BigInt(duration)],
        account: address,
        chain: sepolia
      })
      
      return { hash, etherscanLink: `https://sepolia.etherscan.io/tx/${hash}` }
    } catch (error) {
      console.error('无抵押借款失败:', error)
      throw error
    }
  }

  // 有抵押借款
  const borrow = async (amount: string, collateralAmount: string, duration: number) => {
    try {
      if (!isConnected || !address) throw new Error('钱包未连接')
      
      const amountInWei = parseEther(amount)
      const collateralInWei = parseEther(collateralAmount)
      
      // 发送交易
      const hash = await writeContractAsync({
        address: CORE_LENDING_ADDRESS as `0x${string}`,
        abi: CoreLendingABI,
        functionName: 'borrow',
        args: [amountInWei, collateralInWei, BigInt(duration)],
        account: address,
        chain: sepolia
      })
      
      return { hash, etherscanLink: `https://sepolia.etherscan.io/tx/${hash}` }
    } catch (error) {
      console.error('有抵押借款失败:', error)
      throw error
    }
  }
  
  // 还款
  const repay = async (loanId: number) => {
    try {
      if (!isConnected || !address) throw new Error('钱包未连接')
      
      // 发送交易
      const hash = await writeContractAsync({
        address: CORE_LENDING_ADDRESS as `0x${string}`,
        abi: CoreLendingABI,
        functionName: 'repay',
        args: [BigInt(loanId)],
        account: address,
        chain: sepolia
      })
      
      return { hash, etherscanLink: `https://sepolia.etherscan.io/tx/${hash}` }
    } catch (error) {
      console.error('还款失败:', error)
      throw error
    }
  }

  return {
    borrowWithoutCollateral,
    borrow,
    repay,
    isConnected,
    address
  }
}

export default useContractService
