export const v2DistributorAbi = [
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
    name: 'MerkleDistributorV2__AlreadyBurn',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MerkleDistributorV2__AlreadyClaimed',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MerkleDistributorV2__ClaimFeeTransactionFailed',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MerkleDistributorV2__Finished',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MerkleDistributorV2__InvalidClaimFee',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MerkleDistributorV2__InvalidPaginationParams',
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
    name: 'MerkleDistributorV2__InvalidParams',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MerkleDistributorV2__InvalidProof',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MerkleDistributorV2__NoClaimableOrNotVip',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MerkleDistributorV2__NotStarted',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MerkleDistributorV2__NothingToBurn',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MerkleDistributorV2__PermissionDenied',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MerkleDistributorV2__Unfinished',
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
    name: 'Burned',
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
    name: 'Claimed',
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
        internalType: 'uint40',
        name: 'startTime',
        type: 'uint40',
      },
    ],
    name: 'Created',
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
    name: 'burn',
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
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
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
            internalType: 'uint40',
            name: 'startTime',
            type: 'uint40',
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
        internalType: 'uint40',
        name: 'startTime',
        type: 'uint40',
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
    inputs: [
      {
        internalType: 'uint256',
        name: 'distributionId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'wallet',
        type: 'address',
      },
    ],
    name: 'isClaimed',
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
