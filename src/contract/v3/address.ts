import { bscTestnet, opBNBTestnet } from 'wagmi/chains'

const dev = {
  [bscTestnet.id]: {
    bondingCurve: '0xE9AdAc9b4c9e9b1811C9Ad97fF6FfEa3cf392267',
    distributor: '0x07d190D2b5bBfab0bdDcf2C1F4Abd9dC03858eBf',
    recommend: '0x3eA475f1B0B92DD315da2793BcFCFdCbB4006886',
  },
  [opBNBTestnet.id]: {
    bondingCurve: '0x58B29FC37C9d11d7F1dA0b5e1fA5D7495e8295C6',
    distributor: '0x9C1f8dfB0C9E335cbBB4E4DEAAAf79eb16689FaA',
    recommend: '0x884B7a0044Eda9b3573409047e1a18a67f365E57',
  },
} as const

export const v3Addr = dev
