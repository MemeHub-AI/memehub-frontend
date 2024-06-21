import { bscTestnet } from 'wagmi/chains'

const dev = {
  [bscTestnet.id]: {
    bondingCurve: '0x148De8b81Cf9864dd543b3db41Eba07Ee986275D',
    distributor: '0x8BFEca05063bB9DaC56DbF4f80acBa3754f6C9Fa',
    recommend: '0x8c24b69eE0b9008326597a175b20C3642f9b55d5',
  },
} as const

export const v3Addr = dev
