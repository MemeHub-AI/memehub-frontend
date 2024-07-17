import { Address } from 'viem'
import { bscTestnet, opBNBTestnet, bsc, blast, base } from 'wagmi/chains'

import { dotenv } from '@/utils/env'

type Keys = 'bondingCurve' | 'distributor' | 'recommend'

const prod: Record<number, Record<Keys, Address> | undefined> = {}

const dev: Record<number, Record<Keys, Address> | undefined> = {
  [bsc.id]: {
    bondingCurve: '0x2d3b2Ff5930c1710204aE2c16E3C464De4a653EF',
    distributor: '0x16d489F983e62d6A7319A0a33256D6395457da81',
    recommend: '0x80Ba6203Ac72bb8F4D807E3A58412Bc6B2A9f3da',
  },
  [blast.id]: {
    bondingCurve: '0x3558F554C56067cEa77457F7329FfB55189A29e3',
    distributor: '0x52b765cDC8f1a4b871BfCe21B19A30B7C14A2a08',
    recommend: '0x3e5E1904d24427441Fef1FdCFB2f7B9288b8BbeD',
  },
  [base.id]: {
    bondingCurve: '0x15374e7000d9633a3E7782998407Eb98293E478f',
    distributor: '0x7a4CC06c68F4c4AfA5B0BFC11511370a2852d877',
    recommend: '0x9552e34D141725f812acE96014a6Bb5946cC3931',
  },

  // testnet
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
