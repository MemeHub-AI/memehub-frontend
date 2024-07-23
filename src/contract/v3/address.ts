import { Address } from 'viem'
import { bscTestnet, opBNBTestnet, bsc, blast, base } from 'wagmi/chains'

import { dotenv } from '@/utils/env'

type Keys =
  | 'bondingCurve'
  | 'distributor'
  | 'recommend'
  | 'exchangeNft'
  | 'kolNft'
  | 'ido'

const prod: Record<number, Record<Keys, Address> | undefined> = {
  [bsc.id]: {
    exchangeNft: '0xeB22DaC6525b0763AC0fEa2834Ca2C396859b3BF',
    kolNft: '0x4e1571c2460034A5Fe120aE312678cB3180BFC74',
    ido: '0xCa96dC5e86543cd185B39Fe48194890c57b6a38f',
  },
  [base.id]: {
    exchangeNft: '0xeB22DaC6525b0763AC0fEa2834Ca2C396859b3BF',
    kolNft: '0x4e1571c2460034A5Fe120aE312678cB3180BFC74',
  },
  [blast.id]: {
    exchangeNft: '0xeB22DaC6525b0763AC0fEa2834Ca2C396859b3BF',
    kolNft: '0x4e1571c2460034A5Fe120aE312678cB3180BFC74',
  },
}

const dev: Record<number, Record<Keys, Address> | undefined> = {
  [bsc.id]: {
    bondingCurve: '0x2d3b2Ff5930c1710204aE2c16E3C464De4a653EF',
    distributor: '0x16d489F983e62d6A7319A0a33256D6395457da81',
    recommend: '0x80Ba6203Ac72bb8F4D807E3A58412Bc6B2A9f3da',
    exchangeNft: '0x5f5EAC903c8CCf445671580C178a7B6815519a12',
    kolNft: '0x5859AdD7DA6107D1FA4FC3aB98D242aAF310d61e',
    ido: '0xF7dbaBCC9B132D3a5f726357ecf5dDDC49DfDC84',
  },
  [base.id]: {
    bondingCurve: '0x15374e7000d9633a3E7782998407Eb98293E478f',
    distributor: '0x7a4CC06c68F4c4AfA5B0BFC11511370a2852d877',
    recommend: '0x9552e34D141725f812acE96014a6Bb5946cC3931',
    exchangeNft: '0xBe6544fb6041Fc0638D1E03A8ff41Fc718596758',
    kolNft: '0x416F8eAA8c46A02A7d967A7a3cf0464322c6EC71',
  },
  [blast.id]: {
    bondingCurve: '0x3558F554C56067cEa77457F7329FfB55189A29e3',
    distributor: '0x52b765cDC8f1a4b871BfCe21B19A30B7C14A2a08',
    recommend: '0x3e5E1904d24427441Fef1FdCFB2f7B9288b8BbeD',
    exchangeNft: '0xdBcf1F26CA92F61ba0C466a68F06460158339b05',
    kolNft: '0x0d23ffeeb39A15aC87695749540b6536cD1Dc1EE',
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

export const v3Addr = dotenv.isDev ? dev : prod
