export const v3DistributorAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'bond_',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'target',
        type: 'address',
      },
    ],
    name: 'AddressEmptyCode',
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
    name: 'AddressInsufficientBalance',
    type: 'error',
  },
  {
    inputs: [],
    name: 'FailedInnerCall',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MEMEHUB_AlreadyBurn',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MEMEHUB_AlreadyClaimed',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MEMEHUB_CallerNotEOA',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MEMEHUB_Finished',
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
    name: 'MEMEHUB_NotStarted',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MEMEHUB_NothingToBurn',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MEMEHUB_PermissionDenied',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MEMEHUB_Unfinished',
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
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'SafeERC20FailedOperation',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'distributionId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'MemeHubBurned',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'distributionId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'MemeHubClaimed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'distributionId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'startTime',
        type: 'uint64',
      },
    ],
    name: 'MemeHubCreatedDev',
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
        name: 'distributionId',
        type: 'uint256',
      },
    ],
    name: 'burnToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'distributionId',
        type: 'uint256',
      },
      {
        internalType: 'bytes32[]',
        name: 'merkleProofKOL',
        type: 'bytes32[]',
      },
      {
        internalType: 'bytes32[]',
        name: 'merkleProofCommunity',
        type: 'bytes32[]',
      },
    ],
    name: 'claim',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
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
      {
        components: [
          {
            internalType: 'address',
            name: 'token',
            type: 'address',
          },
          {
            internalType: 'uint176',
            name: 'supply',
            type: 'uint176',
          },
          {
            internalType: 'uint64',
            name: 'startTime',
            type: 'uint64',
          },
          {
            internalType: 'bool',
            name: 'isKol',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'isCommunity',
            type: 'bool',
          },
        ],
        internalType: 'struct IMEMEHUB_Distributor.TokenParam',
        name: 'tp',
        type: 'tuple',
      },
    ],
    name: 'createDistribution',
    outputs: [],
    stateMutability: 'nonpayable',
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
    name: 'distributions',
    outputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint40',
        name: 'walletCountKOL',
        type: 'uint40',
      },
      {
        internalType: 'uint40',
        name: 'walletCountCommunity',
        type: 'uint40',
      },
      {
        internalType: 'uint40',
        name: 'claimedCountKOL',
        type: 'uint40',
      },
      {
        internalType: 'uint40',
        name: 'claimedCountCommunity',
        type: 'uint40',
      },
      {
        internalType: 'uint64',
        name: 'startTime',
        type: 'uint64',
      },
      {
        internalType: 'bool',
        name: 'isKOL',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'isCommunity',
        type: 'bool',
      },
      {
        internalType: 'uint176',
        name: 'amountPerClaimKOL',
        type: 'uint176',
      },
      {
        internalType: 'uint176',
        name: 'amountPerClaimCommunity',
        type: 'uint176',
      },
      {
        internalType: 'bytes32',
        name: 'merkleRootKOL',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 'merkleRootCommunity',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'distributionId',
        type: 'uint256',
      },
    ],
    name: 'getAmountClaimed',
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
        name: 'distributionId',
        type: 'uint256',
      },
    ],
    name: 'getAmountLeft',
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
    name: 'renounceOwnership',
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
    inputs: [
      {
        internalType: 'uint256',
        name: 'timeOfDuration',
        type: 'uint256',
      },
    ],
    name: 'updateEndTime',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
] as const
