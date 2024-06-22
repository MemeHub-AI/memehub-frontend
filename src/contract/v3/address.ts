import { bscTestnet } from 'wagmi/chains'

const dev = {
  [bscTestnet.id]: {
    bondingCurve: '0xb908CF5FA0b75315378ce87E9Ca4600Cea976781',
    distributor: '0xB489CC7FE0bB978845B69bC4F38b615071BE6f2F',
    recommend: '0xB3f0A68fEeAE9E74f049fb99860e0402a6F6cF01',
  },
} as const

export const v3Addr = dev
