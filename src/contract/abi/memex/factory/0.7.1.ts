export const memexFactoryAbi0_7_1 = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_bond',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'MEMEHUB_FeeInsufficient',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MEMEHUB_IllegalAddress',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'param',
        type: 'string',
      },
    ],
    name: 'MEMEHUB_InvalidParams',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MEMEHUB_InvalidParamsReferrers',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MEMEHUB_NoOwner',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MEMEHUB_NotEOA',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MEMEHUB_ValueNotTrue',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'flag',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'version',
        type: 'string',
      },
    ],
    name: 'MemeHubContractDeploy',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'projectId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'memeXAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'startTime',
        type: 'uint256',
      },
    ],
    name: 'MemeHubProjectCreate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'referrer',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'flag',
        type: 'uint256',
      },
    ],
    name: 'MemeHubReferrer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    inputs: [],
    name: 'ETHAmountOfLike',
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
    name: 'bond',
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
        internalType: 'uint256',
        name: '_projectId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_initAmountIn',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_referrer',
        type: 'address',
      },
      {
        internalType: 'string[]',
        name: '_tokenInfos',
        type: 'string[]',
      },
      {
        internalType: 'uint256[]',
        name: '_tokenParams',
        type: 'uint256[]',
      },
      {
        components: [
          {
            internalType: 'bool',
            name: 'isDistribution',
            type: 'bool',
          },
          {
            internalType: 'uint40',
            name: 'distributionRatioKol',
            type: 'uint40',
          },
          {
            internalType: 'uint40',
            name: 'distributionRatioCommunity',
            type: 'uint40',
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
            internalType: 'uint16',
            name: 'kolFlag',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'CommunityFlag',
            type: 'uint16',
          },
          {
            internalType: 'uint256[]',
            name: 'flag',
            type: 'uint256[]',
          },
        ],
        internalType: 'struct IMEMEHUB_Distributor.DistributionParams',
        name: 'dp',
        type: 'tuple',
      },
    ],
    name: 'create',
    outputs: [
      {
        internalType: 'contract MEMEHUB_MemeX',
        name: 'ido',
        type: 'address',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'duration',
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
    name: 'ethAmount',
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
        internalType: 'uint256[]',
        name: 'projectIds',
        type: 'uint256[]',
      },
      {
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'getIdoInfos',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'token',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'likeCount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxCount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'ETHAmountOfLike',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'ownerRatio',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'userAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'alreadyClaimCount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'startTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'endTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'overTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'waitingTime',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'initAmountIn',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'isCanClaimToken',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'isClaimToken',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'isLike',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'isInitWithdrawETH',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'isDeploy',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'isOver',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'isHasInitWithdraw',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'isCanWithdraw',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'isWithdrawETH',
            type: 'bool',
          },
        ],
        internalType: 'struct IMEMEHUB_MemeX.ProjectInfo[]',
        name: 'infos',
        type: 'tuple[]',
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
    name: 'idos',
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
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'isAdmin',
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
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'isLegal',
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
    inputs: [],
    name: 'maxBuy',
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
    name: 'maxCount',
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
    name: 'owner',
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
    name: 'ownerRatio',
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
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'rescueETHMemeHub',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: '_memex',
        type: 'address[]',
      },
      {
        internalType: 'address',
        name: '_to',
        type: 'address',
      },
    ],
    name: 'rescueETHMemeX',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: '_memex',
        type: 'address[]',
      },
      {
        internalType: 'address[]',
        name: '_tokens',
        type: 'address[]',
      },
      {
        internalType: 'address',
        name: '_to',
        type: 'address',
      },
    ],
    name: 'rescueTokenMemeX',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_admin',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: '_status',
        type: 'bool',
      },
    ],
    name: 'setAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_bond',
        type: 'address',
      },
    ],
    name: 'setBond',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_duration',
        type: 'uint256',
      },
    ],
    name: 'setDuration',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_ETHAmountOfLike',
        type: 'uint256',
      },
    ],
    name: 'setETHAmountOfLike',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_ethAmount',
        type: 'uint256',
      },
    ],
    name: 'setEthAmount',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_maxBuy',
        type: 'uint256',
      },
    ],
    name: 'setMaxBuy',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_maxCount',
        type: 'uint256',
      },
    ],
    name: 'setMaxCount',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_ownerRatio',
        type: 'uint256',
      },
    ],
    name: 'setOwnerRatio',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_startTime',
        type: 'uint256',
      },
    ],
    name: 'setStartTime',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_waitingTime',
        type: 'uint256',
      },
    ],
    name: 'setWaitingTime',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'startTime',
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
        internalType: 'uint256',
        name: '_ethAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_maxCount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_ETHAmountOfLike',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_ownerRatio',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_duration',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_waitingTime',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_maxBuy',
        type: 'uint256',
      },
    ],
    name: 'test',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'versions',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'waitingTime',
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
    stateMutability: 'payable',
    type: 'receive',
  },
] as const
