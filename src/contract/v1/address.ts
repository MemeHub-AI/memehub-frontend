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

import { dotenv } from '@/utils/env'

const prod = {
  factory: {
    [mainnet.id]: '',
    [bsc.id]: '0x088F3DEb771A6a7608b6FBd5715708F5957F63fD',
    [opBNB.id]: '0x6F42595e0191c9607582c188F309d53DD42A5e87',
    [scroll.id]: '0x35Ce38AC48Dd3c7Bf6bd14dE8e81128d76E11885',
  },
  uniswapV2: '0x9B3336186a38E1b6c21955d112dbb0343Ee061eE',
} as const

const dev = {
  factory: {
    // testnet
    [sepolia.id]: '',
    [bscTestnet.id]: '0x5d562bC8Ae3bA73d57AaBE2312a65aFEcb743edd',
    [opBNBTestnet.id]: '0xc41e4eD93523A589721372BE819aB24D48E9E4B9',
    [scrollSepolia.id]: '',

    // mainnet
    [mainnet.id]: '',
    [bsc.id]: '0xEa243c53515821148B80d62600525D188BE0F3ed',
    [opBNB.id]: '0x088F3DEb771A6a7608b6FBd5715708F5957F63fD',
    [scroll.id]: '0x34EeA145539327499A00B499F05b6e8eD3FdCbdc',
  },
  uniswapV2: '0x9B3336186a38E1b6c21955d112dbb0343Ee061eE',
} as const

export const v1Addr = dotenv.isProd ? prod : dev
