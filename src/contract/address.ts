import {
  sepolia,
  bscTestnet,
  opBNBTestnet,
  scrollSepolia,
  mainnet,
  bsc,
  opBNB,
  scroll,
} from '@wagmi/core/chains'

export const idoAddress = '0x1778EDfF5DBD9a64Fa54D237F828F317DB884056'

export const zeroAddress = '0x0000000000000000000000000000000000000000'

const prod = {
  factory: {
    // only mainnet
    [mainnet.id]: '',
    [bsc.id]: '0x088F3DEb771A6a7608b6FBd5715708F5957F63fD',
    [opBNB.id]: '',
    [scroll.id]: '0x35Ce38AC48Dd3c7Bf6bd14dE8e81128d76E11885',
  },
  uniswapV2: '0x9B3336186a38E1b6c21955d112dbb0343Ee061eE',
} as const

const dev = {
  factory: {
    // testnet
    [sepolia.id]: '',
    [bscTestnet.id]: '0x5d562bC8Ae3bA73d57AaBE2312a65aFEcb743edd',
    [opBNBTestnet.id]: '',
    [scrollSepolia.id]: '',

    // mainnet
    [mainnet.id]: '',
    [bsc.id]: '',
    [opBNB.id]: '',
    [scroll.id]: '0x34EeA145539327499A00B499F05b6e8eD3FdCbdc',
  },
  uniswapV2: '0x9B3336186a38E1b6c21955d112dbb0343Ee061eE',
} as const

export const ca = process.env.NODE_ENV === 'production' ? prod : dev
