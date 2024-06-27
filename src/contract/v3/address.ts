import { bscTestnet, opBNBTestnet } from 'wagmi/chains'

const dev = {
  [bscTestnet.id]: {
    bondingCurve: '0x512034e2960763bb9bC5287Ebac4687F533e0461',
    distributor: '0x18A0176A05B6DA45919720F1C36E6Ed8F5b61182',
    recommend: '0xc867230a6f6CEE5703C628dF8798F4e49BDEAEB1',
  },
  [opBNBTestnet.id]: {
    bondingCurve: '0x5d6FB3df755aF81C6a30c9C422b6506CC77bB0a3',
    distributor: '0xdf3dd775aA9bB752e8Cb947279034A9fcB5cd680',
    recommend: '0x04EA154B8Ae56C7CdD65DA29e1DEB77D50426574',
  },
} as const

export const v3Addr = dev
