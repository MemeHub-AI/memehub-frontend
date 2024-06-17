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
    bond: '0x14788940f20FB0C0f30272Db76d6DEeF7ed48412',
    token: '0x7a409D70Ed5425cd6f5873A3480F78cF57cFc46a',
    zapV1: '0x0376b5dFc5DfCc3F429D46E83A577a8A00ad390E',
    distributor: '0xc36FD245B361Ca83f9bfEb5618f7dbC1500f8b74',
    recommend: '0x6c1E1D90Fe8c4576362ccD41A3F19334c73Af53e',
  },
} as const

export const v2Addr = dev
