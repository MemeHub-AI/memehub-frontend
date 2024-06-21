export const v3BondingCurveAbi = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'initVirtualEthReserve',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'MEMEHUB_Referrers__InvalidParams',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MemeHub_AlreadyGraduated',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MemeHub_DeadlineExceeded',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MemeHub_FeeTooHigh',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MemeHub_Forbidden',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MemeHub_InsufficientEthReserve',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MemeHub_InsufficientMcap',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MemeHub_InsufficientOutput',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MemeHub_InsufficientTokenReserve',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MemeHub_InvalidAmountIn',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MemeHub_Paused',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MemeHub_TooMuchMcap',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'contract MEMEHUB_Token',
        name: 'token',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountIn',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256',
      },
    ],
    name: 'MemeHubContinuousBurnDev',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'contract MEMEHUB_Token',
        name: 'token',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountIn',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256',
      },
    ],
    name: 'MemeHubContinuousMintDev',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'contract MEMEHUB_Token',
        name: 'token',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'creator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'symbol',
        type: 'string',
      },
    ],
    name: 'MemeHubDeployTokenDev',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'contract MEMEHUB_Token',
        name: 'token',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'contract MEMEHUB_Master',
        name: 'headmaster',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'poolId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountToken',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountETH',
        type: 'uint256',
      },
    ],
    name: 'MemeHubTokenGraduated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'contract MEMEHUB_Token',
        name: 'token',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'price',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'mcapInEth',
        type: 'uint256',
      },
    ],
    name: 'PriceUpdate',
    type: 'event',
  },
  {
    inputs: [],
    name: 'DECIMALS',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'FEE_DENOMINATOR',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'INIT_REAL_TOKEN_RESERVE',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'INIT_VIRTUAL_TOKEN_RESERVE',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'K_',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MAX_FEE',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'TOTAL_SUPPLY',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'airdropRate_',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract MEMEHUB_Token',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amountIn',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amountOutMin',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
      {
        internalType: 'address[]',
        name: 'referrers',
        type: 'address[]',
      },
    ],
    name: 'burn',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract MEMEHUB_Token',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amountIn',
        type: 'uint256',
      },
    ],
    name: 'calcAmountOutFromEth',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract MEMEHUB_Token',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amountIn',
        type: 'uint256',
      },
    ],
    name: 'calcAmountOutFromToken',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract MEMEHUB_Token',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'calcPrice',
    outputs: [
      {
        internalType: 'uint256',
        name: 'lastPrice',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'symbol',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'addPoolETHAmount',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'bool',
            name: 'isDistribution',
            type: 'bool',
          },
          {
            internalType: 'uint8',
            name: 'distributionRatioKol',
            type: 'uint8',
          },
          {
            internalType: 'uint8',
            name: 'distributionRatioCommunity',
            type: 'uint8',
          },
          {
            internalType: 'uint40',
            name: 'walletCountKol',
            type: 'uint40',
          },
          {
            internalType: 'uint40',
            name: 'walletCountCommunity',
            type: 'uint40',
          },
          {
            internalType: 'bytes32',
            name: 'merkleRootKol',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'merkleRootCommunity',
            type: 'bytes32',
          },
        ],
        internalType: 'struct IMEMEHUB_Distributor.DistributionParams',
        name: 'dp',
        type: 'tuple',
      },
    ],
    name: 'createToken',
    outputs: [
      {
        internalType: 'contract MEMEHUB_Token',
        name: 'token',
        type: 'address',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'creationFee_',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'distributor_',
    outputs: [
      {
        internalType: 'contract MEMEHUB_Distributor',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'feeRate_',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'feeTo_',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract MEMEHUB_Token',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'getPool',
    outputs: [
      {
        components: [
          {
            internalType: 'contract MEMEHUB_Token',
            name: 'token',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'tokenReserve',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'virtualTokenReserve',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'ethReserve',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'virtualEthReserve',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'lastPrice',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'lastMcapInEth',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'lastTimestamp',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'lastBlock',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'addPoolETHAmount',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'creator',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'headmaster',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'poolId',
            type: 'uint256',
          },
        ],
        internalType: 'struct MEMEHUB_BondingCurve.Pool',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'graduationThreshold_',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'headmaster_',
    outputs: [
      {
        internalType: 'contract MEMEHUB_Master',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'initVirtualEthReserve_',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract MEMEHUB_Token',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amountIn',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amountOutMin',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
      {
        internalType: 'address[]',
        name: 'referrers',
        type: 'address[]',
      },
    ],
    name: 'mint',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amountOut',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner_',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused_',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract MEMEHUB_Token',
        name: '',
        type: 'address',
      },
    ],
    name: 'pools_',
    outputs: [
      {
        internalType: 'contract MEMEHUB_Token',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenReserve',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'virtualTokenReserve',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'ethReserve',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'virtualEthReserve',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lastPrice',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lastMcapInEth',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lastTimestamp',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lastBlock',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'addPoolETHAmount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'creator',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'headmaster',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'poolId',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'recommendFee_',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'recommend_',
    outputs: [
      {
        internalType: 'contract MEMEHUB_Recommend',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'feeRate',
        type: 'uint256',
      },
    ],
    name: 'setAirdropRate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'fee',
        type: 'uint256',
      },
    ],
    name: 'setCreationFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'feeRate',
        type: 'uint256',
      },
    ],
    name: 'setFeeRate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'feeTo',
        type: 'address',
      },
    ],
    name: 'setFeeTo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract MEMEHUB_Master',
        name: 'headmaster',
        type: 'address',
      },
    ],
    name: 'setHeadmaster',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'initVirtualEthReserve',
        type: 'uint256',
      },
    ],
    name: 'setInitVirtualEthReserve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'setOwner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: 'paused',
        type: 'bool',
      },
    ],
    name: 'setPaused',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256[]',
        name: '_recommendFee',
        type: 'uint256[]',
      },
    ],
    name: 'updateRecommedFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
