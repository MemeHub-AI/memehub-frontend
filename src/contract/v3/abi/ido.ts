export const idoAbi = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'AlreadyClaimedEth',
    type: 'error',
  },
  {
    inputs: [],
    name: 'AlreadyClaimedToken',
    type: 'error',
  },
  {
    inputs: [],
    name: 'AlreadyDeposit',
    type: 'error',
  },
  {
    inputs: [],
    name: 'AlreadyEnd',
    type: 'error',
  },
  {
    inputs: [],
    name: 'AlreadyRandom',
    type: 'error',
  },
  {
    inputs: [],
    name: 'IncorrectValue',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NFTOfEXCommunityIsZeroAddress',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NFTOfKolIsZeroAddress',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NoDeposit',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NoQualificationOrAlreadyClaim',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NoSetTokenAmount',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NoStartClaim',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NoStartRaise',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NoStartWithdraw',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NoTrueRandomOfLeader',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NoTrueRandomOfMember',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotEOA',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotOver',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotPeriod',
    type: 'error',
  },
  {
    inputs: [],
    name: 'OverPerUserLimit',
    type: 'error',
  },
  {
    inputs: [],
    name: 'PoolCanceled',
    type: 'error',
  },
  {
    inputs: [],
    name: 'PoolEnded',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ReentrancyGuardReentrantCall',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'poolId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'buyAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'userWeight',
        type: 'uint256',
      },
    ],
    name: 'IdoBuy',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'poolId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'userAddress',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'refundAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'refundTo',
        type: 'address',
      },
    ],
    name: 'IdoClaimEth',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'poolId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'userAddress',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'claimAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'claimTo',
        type: 'address',
      },
    ],
    name: 'IdoClaimToken',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint40',
        name: 'startTime',
        type: 'uint40',
      },
      {
        indexed: false,
        internalType: 'uint40',
        name: 'endTime',
        type: 'uint40',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'totalETHAmount',
        type: 'uint256',
      },
    ],
    name: 'IdoPoolInit',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'poolId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint8',
        name: 'status',
        type: 'uint8',
      },
    ],
    name: 'IdoSetPoolStatus',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
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
    inputs: [],
    name: 'SCALE',
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
        name: 'adr',
        type: 'address',
      },
    ],
    name: 'authorize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: '_users',
        type: 'address[]',
      },
      {
        internalType: 'uint256',
        name: '_status',
        type: 'uint256',
      },
    ],
    name: 'batchSetWhiteList',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_poolId',
        type: 'uint256',
      },
      {
        internalType: 'bytes32[]',
        name: '_merkleproof',
        type: 'bytes32[]',
      },
      {
        internalType: 'uint256',
        name: '_type',
        type: 'uint256',
      },
    ],
    name: 'buy',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_poolId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_to',
        type: 'address',
      },
    ],
    name: 'claimEth',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_poolId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_to',
        type: 'address',
      },
    ],
    name: 'claimToken',
    outputs: [],
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
    inputs: [
      {
        internalType: 'uint256',
        name: '_poolId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_userAddress',
        type: 'address',
      },
    ],
    name: 'getClaimEthAmount',
    outputs: [
      {
        internalType: 'uint256',
        name: 'refunds',
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
        name: '_poolId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_userAddress',
        type: 'address',
      },
    ],
    name: 'getClaimTokenAmount',
    outputs: [
      {
        internalType: 'uint256',
        name: 'claimAmount',
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
        name: '_poolId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_userAddress',
        type: 'address',
      },
    ],
    name: 'getIsClaimedEth',
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
        name: '_poolId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_userAddress',
        type: 'address',
      },
    ],
    name: 'getIsClaimedToken',
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
        name: '_poolId',
        type: 'uint256',
      },
    ],
    name: 'getPoolUserAddresses',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_poolId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
    ],
    name: 'getUserInfo',
    outputs: [
      {
        internalType: 'uint256',
        name: 'deposit',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'weight',
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
        name: '_user',
        type: 'address',
      },
      {
        internalType: 'bytes32[]',
        name: '_merkleproof',
        type: 'bytes32[]',
      },
      {
        internalType: 'uint256',
        name: '_type',
        type: 'uint256',
      },
    ],
    name: 'getUserWeight',
    outputs: [
      {
        internalType: 'uint256',
        name: 'weight',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint40',
        name: 'startTime',
        type: 'uint40',
      },
      {
        internalType: 'uint40',
        name: 'endTime',
        type: 'uint40',
      },
      {
        internalType: 'uint168',
        name: 'perUserLimit',
        type: 'uint168',
      },
      {
        internalType: 'uint256',
        name: 'totalETHAmount',
        type: 'uint256',
      },
    ],
    name: 'initializePool',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'adr',
        type: 'address',
      },
    ],
    name: 'isAuthorized',
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
        name: 'account',
        type: 'address',
      },
    ],
    name: 'isOwner',
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
    name: 'kolWeight',
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
    name: 'merkleRootCommunity',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'merkleRootKol',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
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
    name: 'poolCount',
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
        name: '',
        type: 'uint256',
      },
    ],
    name: 'pools',
    outputs: [
      {
        internalType: 'contract ERC20',
        name: 'tokenAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'status',
        type: 'uint8',
      },
      {
        internalType: 'uint40',
        name: 'startTime',
        type: 'uint40',
      },
      {
        internalType: 'uint40',
        name: 'endTime',
        type: 'uint40',
      },
      {
        internalType: 'uint168',
        name: 'perUserLimit',
        type: 'uint168',
      },
      {
        internalType: 'uint256',
        name: 'ethBalance',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalETHAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'weightedSum',
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
        name: '_kolWeight',
        type: 'uint256',
      },
    ],
    name: 'setKolWeight',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_merkleRootCommunity',
        type: 'bytes32',
      },
    ],
    name: 'setMerkleRootCommunity',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_merkleRootKol',
        type: 'bytes32',
      },
    ],
    name: 'setMerkleRootKol',
    outputs: [],
    stateMutability: 'nonpayable',
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
    name: 'setNFTOfExchange',
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
    name: 'setNFTOfKol',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_poolId',
        type: 'uint256',
      },
      {
        internalType: 'uint40',
        name: '_endTime',
        type: 'uint40',
      },
    ],
    name: 'setPoolEndTime',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_poolId',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'status',
        type: 'uint8',
      },
    ],
    name: 'setPoolStatus',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_poolId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_tokenAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_tokenAmount',
        type: 'uint256',
      },
    ],
    name: 'setTokenData',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_whitelist',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_status',
        type: 'uint256',
      },
    ],
    name: 'setWhitelist',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address payable',
        name: 'adr',
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
        internalType: 'address',
        name: 'adr',
        type: 'address',
      },
    ],
    name: 'unauthorize',
    outputs: [],
    stateMutability: 'nonpayable',
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
    name: 'whitelist',
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
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
] as const
