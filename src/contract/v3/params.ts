import { bsc, blast, base, bscTestnet, opBNBTestnet } from 'wagmi/chains'
import { Hash, parseEther, zeroHash } from 'viem'

const bnbBondingCurve = {
  addPoolEthAmount: parseEther('10.543536923122173709'),
}

const ethBondingCurve = {
  addPoolEthAmount: parseEther('2.108707384624434741'),
}

const baseBondingCurve = {
  addPoolEthAmount: parseEther('0.090015754923413566'),
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
    bondingCurve: bnbBondingCurve,
    distributor,
  },
  [opBNBTestnet.id]: {
    bondingCurve: bnbBondingCurve,
    distributor,
  },
  [bsc.id]: {
    bondingCurve: bnbBondingCurve,
    distributor,
  },
  [blast.id]: {
    bondingCurve: ethBondingCurve,
    distributor,
  },
  [base.id]: {
    bondingCurve: baseBondingCurve,
    distributor,
  },
}
