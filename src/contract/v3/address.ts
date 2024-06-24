import { bscTestnet, opBNBTestnet, baseSepolia } from 'wagmi/chains'

const dev = {
  [bscTestnet.id]: {
    bondingCurve: '0x516Ab20f4Ee93919EDF99E72340bdFcCAaDb100d',
    distributor: '0x856a0E2e91a73598330335cad3933200E8358D66',
    recommend: '0xb334FFf966CB179147C4c9f81Ad1a22D31B22161',
  },
  [opBNBTestnet.id]: {
    bondingCurve: '0x16238150eFd5b9490157f87904A08B4caec0ee27',
    distributor: '0x21F5C03F8Db42C8e43917C5902A996CD1189eA5A',
    recommend: '0x71f6239b713f9Fdc2D24e73DB6230535b9d4964c',
  },
} as const

export const v3Addr = dev
