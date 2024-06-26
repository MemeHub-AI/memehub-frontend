import { bscTestnet, opBNBTestnet } from 'wagmi/chains'

// bondingCurve: '0x1675F736bBB3bD68A26bDE0B7AfE15316CD2E627',
// distributor: '0x0A5D954f336933481b3EBe3d88c059b36Fd6609d',
// recommend: '0x3821885f067d359c3c409e450910eE1B029b2c62',

const dev = {
  [bscTestnet.id]: {
    bondingCurve: '0x5b0325204B0Aa0E14DbB1c202913bF3ab679E79B',
    distributor: '0x27786aF25a5f4363c287EeF3E6ae917Be5611f4e',
    recommend: '0x01c2ADcf1Fac9e31E3b9c8D0e39B537D7CBb7e86',
  },
  [opBNBTestnet.id]: {
    bondingCurve: '0x16238150eFd5b9490157f87904A08B4caec0ee27',
    distributor: '0x21F5C03F8Db42C8e43917C5902A996CD1189eA5A',
    recommend: '0x71f6239b713f9Fdc2D24e73DB6230535b9d4964c',
  },
} as const

export const v3Addr = dev
