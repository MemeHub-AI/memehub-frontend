import { AirdropType } from '@/constants/airdrop'
import { BcAbiVersion } from '@/contract/abi/bonding-curve'

export const deployVersion = BcAbiVersion.V0_1_0

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
