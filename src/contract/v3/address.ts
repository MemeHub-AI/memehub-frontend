import { bscTestnet, opBNBTestnet } from 'wagmi/chains'

const dev = {
  [bscTestnet.id]: {
    bondingCurve: '0x095BB78B3e674e32480CAD017c4D5206348De613',
    distributor: '0xC89fD95C324e612433A2FA60A51902C2c36D698E',
    recommend: '0x6b070198e58A82fBE39CD9eD53e38edB59d6e4Ef',
  },
  [opBNBTestnet.id]: {
    bondingCurve: '0x2130d664afF9F3EDdAfeCc1a8bA7D33CB28cE557',
    distributor: '0x15cB7b8997484aD75683043b41f6A18B41d87A4F',
    recommend: '0xcf40E990a4ec2E1a3601839c7dD3b3C111AC442b',
  },
} as const

export const v3Addr = dev
