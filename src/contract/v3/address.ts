import { bscTestnet, opBNBTestnet } from 'wagmi/chains'

const dev = {
  [bscTestnet.id]: {
    bondingCurve: '0xfc056f46f12c73eCEA186106f2E830864E739cf8',
    distributor: '0x659e859F60ea89F568530504E0A14A1e383a1081',
    recommend: '0x715cAB9d65673BA3BF4541f35F5B113947083627',
  },
  [opBNBTestnet.id]: {
    bondingCurve: '0x89C87817990F50b520f960C28b73e225E8C1Bbfc',
    distributor: '0xfBe70FADE7D59360F3899b0D2d4C17d26e493B3D',
    recommend: '0x884B7a0044Eda9b3573409047e1a18a67f365E57',
  },
} as const

export const v3Addr = dev
