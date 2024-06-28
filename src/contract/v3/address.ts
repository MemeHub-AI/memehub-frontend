import { bscTestnet, opBNBTestnet } from 'wagmi/chains'

const dev = {
  [bscTestnet.id]: {
    bondingCurve: '0xE9AdAc9b4c9e9b1811C9Ad97fF6FfEa3cf392267',
    distributor: '0x07d190D2b5bBfab0bdDcf2C1F4Abd9dC03858eBf',
    recommend: '0x3eA475f1B0B92DD315da2793BcFCFdCbB4006886',
  },
  [opBNBTestnet.id]: {
    bondingCurve: '0x89C87817990F50b520f960C28b73e225E8C1Bbfc',
    distributor: '0xfBe70FADE7D59360F3899b0D2d4C17d26e493B3D',
    recommend: '0x884B7a0044Eda9b3573409047e1a18a67f365E57',
  },
} as const

export const v3Addr = dev
