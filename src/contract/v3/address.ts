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
    bondingCurve: '0x6445AaFCf697D18aEFf2c8B54a65c390751aad60',
    distributor: '0x9E004ee0abBB11a2756A684C4B543A4eDb675313',
    recommend: '0x526A198E880beDeF856c584BFa94E353C7612f79',
  },
  [blast.id]: {
    bondingCurve: '0x04E43A46CF810Afd193Aeab29C2124F94B42d66D',
    distributor: '0x74Db74A3A9c75bD040ed4693DDfe2d7Af78BDDfC',
    recommend: '0xF395F9243cdb7316130257bF263dc145AD972a66',
  },
  [base.id]: {
    bondingCurve: '0x0525D602F0c7ACEB8da7489441420CcDa5B305f3',
    distributor: '0x115dae585eA9A1654393BCDE0A31eD0b7B3C9818',
    recommend: '0xB964Cb749f80079F7285b488e59B21D12E194b97',
  },
} as const

export const v3Addr = dev
