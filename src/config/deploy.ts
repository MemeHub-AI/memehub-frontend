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
  '0x33665efef2048723cc078145d6c0f64ae6bd5cb4ae7ea41dd0c42dfc34de5af1'

export const deployLogAddrIdx = 1
