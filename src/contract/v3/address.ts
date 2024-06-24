import { bscTestnet, opBNBTestnet, baseSepolia } from 'wagmi/chains'

const dev = {
  [bscTestnet.id]: {
    bondingCurve: '0x9de14d130bd5D9C81b46bb91dD0EF5090e53cF08',
    distributor: '0xc25D08Cf1B9bE9cED76a3BA64b15022e07F69e6C',
    recommend: '0xcf3edA73db4cF88E10213AAB00B997728BFA700E',
  },
  [opBNBTestnet.id]: {
    bondingCurve: '0x16238150eFd5b9490157f87904A08B4caec0ee27',
    distributor: '0x21F5C03F8Db42C8e43917C5902A996CD1189eA5A',
    recommend: '0x71f6239b713f9Fdc2D24e73DB6230535b9d4964c',
  },
} as const

export const v3Addr = dev
