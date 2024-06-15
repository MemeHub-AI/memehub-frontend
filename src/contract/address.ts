import {
  // testnet.
  sepolia,
  bscTestnet,
  opBNBTestnet,
  baseSepolia,
  blastSepolia,
  fantomTestnet,
  zkSyncSepoliaTestnet,

  // mainnet.
  mainnet,
  scroll,
  bsc,
  opBNB,
  base,
  blast,
  fantom,
  zkSync,
} from 'wagmi/chains'

import { dotenv } from '@/utils/env'

export const idoAddress = '0x1778EDfF5DBD9a64Fa54D237F828F317DB884056'

export const uniswapV2Addr = '0x9B3336186a38E1b6c21955d112dbb0343Ee061eE'

// Bonding Curve v2 common address.
export const commonAddr = {
  // testnet.
  [bscTestnet.id]: {
    reserveToken: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
    router: '0xD99D1c33F9fC3444f8101754aBC46c52416550D1',
  },
  [opBNBTestnet.id]: {
    reserveToken: '0x4200000000000000000000000000000000000006',
    router: '0x62ff25cfd64e55673168c3656f4902bd7aa5f0f4',
  },
  [baseSepolia.id]: {
    reserveToken: '0x4200000000000000000000000000000000000006',
    router: '0x1689E7B1F10000AE47eBfE339a4f69dECd19F602',
  },
  [blastSepolia.id]: {
    reserveToken: '0x4300000000000000000000000000000000000004',
    router: '0x974dC76e9fA2c15DbE1b13db93c12478857BaC25',
  },
  [fantomTestnet.id]: {
    reserveToken: '0x07B9c47452C41e8E00f98aC4c075F5c443281d2A',
    router: '0xd38fd047a692c0ae627929a88e5f435d5f777efa',
  },
  [zkSyncSepoliaTestnet.id]: {
    reserveToken: '0x000000000000000000000000000000000000800A',
    router: '',
  },

  // mainnet.
  [mainnet.id]: {
    reserveToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    router: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  },
  [scroll.id]: {
    reserveToken: '0x5300000000000000000000000000000000000004',
    router: '0x9B3336186a38E1b6c21955d112dbb0343Ee061eE',
  },
  [bsc.id]: {
    reserveToken: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    router: '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24',
  },
  [opBNB.id]: {
    reserveToken: '0x4200000000000000000000000000000000000006',
    router: '0x8cfe327cec66d1c090dd72bd0ff11d690c33a2eb',
  },
  [base.id]: {
    reserveToken: '0x4200000000000000000000000000000000000006',
    router: '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24',
  },
  [blast.id]: {
    reserveToken: '0x4300000000000000000000000000000000000004',
    router: '0xBB66Eb1c5e875933D44DAe661dbD80e5D9B03035',
  },
  [fantom.id]: {
    reserveToken: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
    router: '',
  },
  [zkSync.id]: {
    reserveToken: '0x000000000000000000000000000000000000800A',
    router: '',
  },
} as const
