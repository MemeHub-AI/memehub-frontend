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

export const deployLogAddr =
  '0xa3a7acabc8ad665bcfcfedc2636ee2f51875f87b190f17f23583a26c17ae1e88'

export const deployLogAddrIdx = 1
