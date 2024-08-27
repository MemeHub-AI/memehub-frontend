import { AirdropFlag } from '@/enums/airdrop'

export const deployEvmAirdropParams = {
  isDistribution: false,
  distributionRatioKol: 0,
  distributionRatioCommunity: 0,
  walletCountKol: 0,
  walletCountCommunity: 0,
  kolFlag: AirdropFlag.None,
  CommunityFlag: AirdropFlag.None,
  flag: [] as bigint[],
}
