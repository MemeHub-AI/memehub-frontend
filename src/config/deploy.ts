import { AirdropType } from '@/enums/airdrop'

export const deployEvmAirdropParams = {
  isDistribution: false,
  distributionRatioKol: 0,
  distributionRatioCommunity: 0,
  walletCountKol: 0,
  walletCountCommunity: 0,
  kolFlag: AirdropType.None,
  CommunityFlag: AirdropType.None,
  flag: [] as bigint[],
}

export const deployLogAddr =
  '0x353a819cf6bf8092d77d188df7a4f24412519bf3c6426029a55e10fbebf0970e'

export const deployLogAddrIdx = 1
