import { bsc, bscTestnet } from '@wagmi/core/chains'

import { dotenv } from '@/utils/env'
import { reserveTokenAddr, routerAddr } from '../address'

const prod = {
  bond: {
    [bsc.id]: '',
  },
  token: {
    [bsc.id]: '',
  },
  zapV1: {
    [bsc.id]: '',
  },
  reserveTokenAddr,
  routerAddr,
} as const

const dev = {
  bond: {
    [bscTestnet.id]: '0xcc27db6158c2971Af3366e8FEBa5049B64534105',
  },
  token: {
    [bscTestnet.id]: '0xE5eC2c25f86Af9eB47f3f7213e2D88679b92A1cf',
  },
  zapV1: {
    [bscTestnet.id]: '0x80c17A095DaACb58399Db22639Dc3B9c7d62660e',
  },
  reserveTokenAddr,
  routerAddr,
} as const

// Only export this line plz.
export const v2Addr = dev
