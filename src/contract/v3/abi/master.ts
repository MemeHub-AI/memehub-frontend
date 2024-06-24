export const v3MasterAbi = [
  {
    inputs: [
      {
        internalType: 'contract MEMEHUB_BondingCurve',
        name: '_bond',
        type: 'address',
      },
      {
        internalType: 'contract IUniswapV2Router02',
        name: '_uniswapV2Router02',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'MEMEHUB_Forbidden',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MEMEHUB_InvalidAmountEth',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MEMEHUB_InvalidAmountToken',
    type: 'error',
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
        name: 'pair',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountETH',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountToken',
        type: 'uint256',
      },
    ],
    name: 'MemeHubAddLiquidityDev',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'addedLiquidityToken',
    outputs: [
      {
        internalType: 'contract MEMEHUB_Token',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'bond',
    outputs: [
      {
        internalType: 'contract MEMEHUB_BondingCurve',
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
      {
        internalType: 'uint256',
        name: 'amountToken',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amountEth',
        type: 'uint256',
      },
    ],
    name: 'execute',
    outputs: [
      {
        internalType: 'uint256',
        name: '_amountToken',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_amountETH',
        type: 'uint256',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getToken',
    outputs: [
      {
        internalType: 'contract MEMEHUB_Token[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'liquidityOwner',
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
    name: 'uniswapV2Router02',
    outputs: [
      {
        internalType: 'contract IUniswapV2Router02',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
