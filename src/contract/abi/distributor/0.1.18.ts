export const distributorAbi0_1_18 = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'bond_',
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
    name: 'MEMEHUB_NFTAddrNotExist',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MEMEHUB_NFTOfExIsZeroAddress',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MEMEHUB_NFTOfKolIsZeroAddress',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MEMEHUB_NoOwner',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MEMEHUB_NoTrueParams',
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
    name: 'MEMEHUB_TokenAddrNotExist',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MEMEHUB_Unfinished',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MEMEHUB_Unqualified',
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
        indexed: true,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'amount',
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
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'startTime',
        type: 'uint64',
      },
    ],
    name: 'MemeHubCreated',
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
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'NFTAddrs',
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
    name: 'NFTOfExchangeCommunity',
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
    name: 'NFTOfKol',
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
        name: '_NFTOfExchangeCommunity',
        type: 'address',
      },
    ],
    name: 'addNFTAddressOfExchange',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_NFTOfKol',
        type: 'address',
      },
    ],
    name: 'addNFTAddressOfKol',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'addrs',
        type: 'address[]',
      },
    ],
    name: 'addNFTAddrs',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'addrs',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
    ],
    name: 'addTokenAddrs',
    outputs: [],
    stateMutability: 'nonpayable',
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
        internalType: 'uint256',
        name: 'specifiedExId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'specifiedNFT',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'specifiedToken',
        type: 'address',
      },
    ],
    name: 'claimCommunity',
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
        internalType: 'uint256',
        name: 'distributionId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'specifiedKolId',
        type: 'uint256',
      },
    ],
    name: 'claimKol',
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
    inputs: [],
    name: 'communityCheckMax',
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
    name: 'communityCount',
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
    name: 'communityRatio',
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
        ],
        internalType: 'struct IMEMEHUB_Distributor.TokenParam',
        name: 'tp',
        type: 'tuple',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
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
        internalType: 'uint176',
        name: 'amountPerClaimKOL',
        type: 'uint176',
      },
      {
        internalType: 'uint176',
        name: 'amountPerClaimCommunity',
        type: 'uint176',
      },
    ],
    stateMutability: 'view',
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
        internalType: 'uint256[]',
        name: 'ids',
        type: 'uint256[]',
      },
    ],
    name: 'getDistributions',
    outputs: [
      {
        components: [
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
            internalType: 'uint176',
            name: 'amountPerClaimKOL',
            type: 'uint176',
          },
          {
            internalType: 'uint176',
            name: 'amountPerClaimCommunity',
            type: 'uint176',
          },
        ],
        internalType: 'struct MEMEHUB_Distributor.Dis[]',
        name: 'dis',
        type: 'tuple[]',
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
    name: 'hasNFTAddr',
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
    name: 'hasTokenAddr',
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
    name: 'holderAmounts',
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
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'isBurn',
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
    name: 'isClaimedCommunity',
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
        internalType: 'uint256[]',
        name: 'distributionId',
        type: 'uint256[]',
      },
      {
        internalType: 'address',
        name: 'wallet',
        type: 'address',
      },
    ],
    name: 'isClaimedCommunitys',
    outputs: [
      {
        internalType: 'bool[]',
        name: 'isClaimed',
        type: 'bool[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256[]',
        name: 'specifiedExCommunity',
        type: 'uint256[]',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'isClaimedEx',
    outputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
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
    name: 'isClaimedKOL',
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
        internalType: 'uint256[]',
        name: 'distributionId',
        type: 'uint256[]',
      },
      {
        internalType: 'address',
        name: 'wallet',
        type: 'address',
      },
    ],
    name: 'isClaimedKOLs',
    outputs: [
      {
        internalType: 'bool[]',
        name: 'isClaimed',
        type: 'bool[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256[]',
        name: 'specifiedKolId',
        type: 'uint256[]',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'isClaimedKol',
    outputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: '_nftAddrs',
        type: 'address[]',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'isClaimedNFT',
    outputs: [
      {
        internalType: 'address',
        name: 'NFTAddress',
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
        name: 'user',
        type: 'address',
      },
    ],
    name: 'isClaimedNFTAll',
    outputs: [
      {
        internalType: 'address',
        name: 'NFTAddress',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: '_tokenAddrs',
        type: 'address[]',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'isClaimedToken',
    outputs: [
      {
        internalType: 'address',
        name: 'tokenAddress',
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
        name: 'user',
        type: 'address',
      },
    ],
    name: 'isClaimedTokenAll',
    outputs: [
      {
        internalType: 'address',
        name: 'tokenAddress',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'kolCount',
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
    name: 'kolRatio',
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
        name: '_admin',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'status',
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
        name: '_communityCheckMax',
        type: 'uint256',
      },
    ],
    name: 'setCommunityCheckMax',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_communityCount',
        type: 'uint256',
      },
    ],
    name: 'setCommunityCount',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_communityRatio',
        type: 'uint256',
      },
    ],
    name: 'setCommunityRatio',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_kolCount',
        type: 'uint256',
      },
    ],
    name: 'setKolCount',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_kolRatio',
        type: 'uint256',
      },
    ],
    name: 'setKolRatio',
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
    name: 'tokenAddrs',
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
    stateMutability: 'payable',
    type: 'receive',
  },
] as const
