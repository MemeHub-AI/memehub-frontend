import { bscTestnet, opBNBTestnet } from 'wagmi/chains'

const dev = {
  [bscTestnet.id]: {
    bondingCurve: '0xE9AdAc9b4c9e9b1811C9Ad97fF6FfEa3cf392267',
    distributor: '0x07d190D2b5bBfab0bdDcf2C1F4Abd9dC03858eBf',
    recommend: '0x3eA475f1B0B92DD315da2793BcFCFdCbB4006886',
  },
  [opBNBTestnet.id]: {
    bondingCurve: '0xD9F08c5803bbC46D406f802BA57d4506140edf3C',
    distributor: '0xB42C6f9e47A695460BccfC5291a3daA60f5D0d27',
    recommend: '0x884B7a0044Eda9b3573409047e1a18a67f365E57',
  },
} as const

export const v3Addr = dev
