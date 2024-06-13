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
    bond: '0x7DC5689651c0aA95Ee354dFC724046e018438C9d',
    token: '0x4ac6d25f3cd82cb18f8830d2dd517152bad8107f',
    zapV1: '0x12f68F27156Def59e1E66762DbE967ef17ecc8C6',
  },
} as const

export const v2Addr = dev
