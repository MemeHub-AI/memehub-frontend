import { Address } from 'viem'
import {
  mainnet,
  scroll,
  bsc,
  opBNB,
  base,
  blast,
  fantom,
  zkSync,

  // testnet.
  bscTestnet,
  opBNBTestnet,
  baseSepolia,
  blastSepolia,
  fantomTestnet,
  zkSyncSepoliaTestnet,
} from 'wagmi/chains'

export const reserveAddr: Record<number, Address> = {
  [mainnet.id]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  [scroll.id]: '0x5300000000000000000000000000000000000004',
  [bsc.id]: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  [opBNB.id]: '0x4200000000000000000000000000000000000006',
  [base.id]: '0x4200000000000000000000000000000000000006',
  [blast.id]: '0x4300000000000000000000000000000000000004',
  [fantom.id]: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
  [zkSync.id]: '0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91',

  // testnet.
  [bscTestnet.id]: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
  [opBNBTestnet.id]: '0x4200000000000000000000000000000000000006',
  [baseSepolia.id]: '0x4200000000000000000000000000000000000006',
  [blastSepolia.id]: '0x4300000000000000000000000000000000000004',
  [fantomTestnet.id]: '0x07B9c47452C41e8E00f98aC4c075F5c443281d2A',
  [zkSyncSepoliaTestnet.id]: '0x000000000000000000000000000000000000800A',
}
