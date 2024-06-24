import { bscTestnet } from 'wagmi/chains'

const dev = {
  [bscTestnet.id]: {
    bondingCurve: '0xcC91dCF0A6aea1eb4F4E2a9c38C57Aa001454Ad9',
    distributor: '0x2228608249a5F87C1097323ed98abcD3f3D9351B',
    recommend: '0x8deCE3061C890B64D3DCA9fF9438d3F8daed0838',
  },
} as const

export const v3Addr = dev
