import { bscTestnet, opBNBTestnet } from 'wagmi/chains'

const dev = {
  [bscTestnet.id]: {
    bondingCurve: '0x39Ed077AC89Ac69A543BA99fDE3E4B8e9C673729',
    distributor: '0x8c49B95c0c21F417d0dF361DdE53c397d9181d9A',
    recommend: '0x3eA475f1B0B92DD315da2793BcFCFdCbB4006886',
  },
  [opBNBTestnet.id]: {
    bondingCurve: '0x58B29FC37C9d11d7F1dA0b5e1fA5D7495e8295C6',
    distributor: '0x9C1f8dfB0C9E335cbBB4E4DEAAAf79eb16689FaA',
    recommend: '0x884B7a0044Eda9b3573409047e1a18a67f365E57',
  },
} as const

export const v3Addr = dev
