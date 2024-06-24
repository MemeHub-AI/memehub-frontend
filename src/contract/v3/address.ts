import { bscTestnet, opBNBTestnet, baseSepolia } from 'wagmi/chains'

const dev = {
  [bscTestnet.id]: {
    bondingCurve: '0x93dB250B9011b11FfBf56d94E00f4091c8BFe731',
    distributor: '0x15375eF202DEb9915ec6CBcc41E11c35E5f3E9a4',
    recommend: '0x4Edd16799D62c8BD22Cf6BF026657FD8Cd93b9e0',
  },
  [opBNBTestnet.id]: {
    bondingCurve: '0x16238150eFd5b9490157f87904A08B4caec0ee27',
    distributor: '0x21F5C03F8Db42C8e43917C5902A996CD1189eA5A',
    recommend: '0x71f6239b713f9Fdc2D24e73DB6230535b9d4964c',
  },
} as const

export const v3Addr = dev
