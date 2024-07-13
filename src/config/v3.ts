import { Hash, zeroHash } from 'viem'

export const v3DistributorParams = {
  isDistribution: false,
  distributionRatioKol: 0,
  distributionRatioCommunity: 0,
  walletCountKol: 0,
  walletCountCommunity: 0,
  merkleRootKol: zeroHash as Hash,
  merkleRootCommunity: zeroHash as Hash,
}
