import {
  // testnet.
  sepolia,
  bscTestnet,
  // mainnet.
  mainnet,
} from 'wagmi/chains'
import { Config } from 'wagmi'

import { dotenv } from '@/utils/env'

const prod = {} as const

const dev = {
  [bscTestnet.id]: {
    bond: '0x6FDd55823358c49788C50a914b424af2d43F74dd',
    token: '0xb251f4f73d8602830405b5183a4BF46121aa0eBf',
    zapV1: '0x18D136C62A5540D915CDE147ED64a0d64A3Cff62',
    distributor: '0xd0E4502025Eb457873850F30c220CEd00a9c5feD',
  },
} as const

export const v2Addr = dev
