import { bsc, bscTestnet } from '@wagmi/core/chains'

import { dotenv } from '@/utils/env'

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
}

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
}

// Only export this line plz.
export const v2Addr = dotenv.isProd ? prod : dev
