import { bscTestnet, opBNBTestnet, bsc, blast, base } from 'wagmi/chains'

import { dotenv } from '@/utils/env'

const prod = {}

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

  // dev mainnet.
  [bsc.id]: {
    bondingCurve: '0x293f06b08e5463EcD90EA81cA245a7C329e091ee',
    distributor: '0x3E5063Efc490D12C5bF4C0b28122aD376891CDF6',
    recommend: '0x2654cBEFb82410B5E2Df17750d0B936A827386cf',
  },
  [blast.id]: {
    bondingCurve: '0xfDF4c56346A294A4e924005eeFA4da4247753B6C',
    distributor: '0x88Bc6da007fC3f9e086686362d51800c4F54228a',
    recommend: '0x20a52a42047617EcdFDafd34f7f4163D4f3925CD',
  },
  [base.id]: {
    bondingCurve: '0x8e0cbA0e741f9e10250cE58EA9969721dA67b675',
    distributor: '0xfB3De63c7C7368E92e06f86BfCd088e5dF091aEd',
    recommend: '0x0A6b36C71365FBB58C14cE786142437D6e063099',
  },
} as const

export const v3Addr = dev
