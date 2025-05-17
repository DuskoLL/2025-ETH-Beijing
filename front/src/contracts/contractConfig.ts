// 智能合约地址 - 需要替换为实际部署的合约地址
export const CORE_LENDING_ADDRESS = '0x123456789abcdef123456789abcdef123456789a'; // 替换为实际部署的合约地址
export const LENDING_POOL_ADDRESS = '0x987654321fedcba987654321fedcba987654321'; // 替换为实际部署的合约地址

// CoreLending合约ABI
export const CORE_LENDING_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_lendingPool",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_blacklist",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "borrower",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "loanId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "dueTime",
        "type": "uint256"
      }
    ],
    "name": "Borrowed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "borrower",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "loanId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Repaid",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "collateralAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "duration",
        "type": "uint256"
      }
    ],
    "name": "borrow",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "duration",
        "type": "uint256"
      }
    ],
    "name": "borrowWithoutCollateral",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "loanId",
        "type": "uint256"
      }
    ],
    "name": "repay",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

// LendingPool合约ABI
export const LENDING_POOL_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_tokenA",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_tokenB",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "collateralAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "duration",
        "type": "uint256"
      }
    ],
    "name": "borrow",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "loanId",
        "type": "uint256"
      }
    ],
    "name": "repay",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "loanId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "liquidator",
        "type": "address"
      }
    ],
    "name": "liquidate",
    "outputs": [
      {
        "internalType": "bool",
        "name": "needsAuction",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "shortage",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserLoans",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "collateral",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "dueTime",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "liquidated",
            "type": "bool"
          },
          {
            "internalType": "address",
            "name": "borrower",
            "type": "address"
          }
        ],
        "internalType": "struct LendingPool.Loan[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

/**
 * 生成Etherscan链接
 * @param txHash 交易哈希
 * @param chainId 链ID
 * @returns Etherscan链接
 */
export const getEtherscanLink = (txHash: string, chainId: number = 11155111) => {
  // 根据chainId决定使用哪个网络的Etherscan
  let baseUrl = 'https://etherscan.io';
  
  if (chainId === 11155111) {
    baseUrl = 'https://sepolia.etherscan.io';
  } else if (chainId === 1) {
    baseUrl = 'https://etherscan.io';
  }
  
  return `${baseUrl}/tx/${txHash}`;
};
