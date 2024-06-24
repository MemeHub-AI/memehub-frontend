import { bscTestnet, opBNBTestnet, baseSepolia } from 'wagmi/chains'

const dev = {
  [bscTestnet.id]: {
    bondingCurve: '0xcC91dCF0A6aea1eb4F4E2a9c38C57Aa001454Ad9',
    distributor: '0x2228608249a5F87C1097323ed98abcD3f3D9351B',
    recommend: '0x8deCE3061C890B64D3DCA9fF9438d3F8daed0838',
  },
  [opBNBTestnet.id]: {
    bondingCurve: '0x16238150eFd5b9490157f87904A08B4caec0ee27',
    distributor: '0x21F5C03F8Db42C8e43917C5902A996CD1189eA5A',
    recommend: '0x71f6239b713f9Fdc2D24e73DB6230535b9d4964c',
  },
} as const

export const v3Addr = dev
