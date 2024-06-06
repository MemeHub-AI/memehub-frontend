import {
  mainnet,
  opBNB,
  bsc,
  scroll,
  bscTestnet,
  opBNBTestnet,
} from 'wagmi/chains'

export const idoAddress = '0x1778EDfF5DBD9a64Fa54D237F828F317DB884056'

export const reserveTokenAddr = {
  [bscTestnet.id]: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
  [opBNBTestnet.id]: '0x4200000000000000000000000000000000000006',

  [mainnet.id]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  [scroll.id]: '0x5300000000000000000000000000000000000004',
  [bsc.id]: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  [opBNB.id]: '0x4200000000000000000000000000000000000006',
} as const

export const routerAddr = {
  [bscTestnet.id]: '0xD99D1c33F9fC3444f8101754aBC46c52416550D1',
  [opBNBTestnet.id]: '0x62ff25cfd64e55673168c3656f4902bd7aa5f0f4',

  [mainnet.id]: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  [scroll.id]: '0x9B3336186a38E1b6c21955d112dbb0343Ee061eE',
  [bsc.id]: '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24',
  [opBNB.id]: '0x8cfe327cec66d1c090dd72bd0ff11d690c33a2eb',
} as const
