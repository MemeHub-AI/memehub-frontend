import { bscTestnet, opBNBTestnet } from 'wagmi/chains'
import { Hash, parseEther, zeroHash } from 'viem'

const bondingCurve = {
  addPoolEthAmount: parseEther('10.345'),
}

const distributor = {
  isDistribution: false,
  distributionRatioKol: 0,
  distributionRatioCommunity: 0,
  walletCountKol: 0,
  walletCountCommunity: 0,
  merkleRootKol: zeroHash as Hash,
  merkleRootCommunity: zeroHash as Hash,
}

export const v3Params = {
  [bscTestnet.id]: {
    bondingCurve,
    distributor,
  },
  [opBNBTestnet.id]: {
    bondingCurve,
    distributor,
  },
}
