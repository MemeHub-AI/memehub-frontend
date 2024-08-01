export enum AirdropType {
  None,
  Assign,
  All,
}

export const v3DistributorParams = {
  isDistribution: false,
  distributionRatioKol: 0,
  distributionRatioCommunity: 0,
  walletCountKol: 0,
  walletCountCommunity: 0,
  kolFlag: AirdropType.None,
  CommunityFlag: AirdropType.None,
}
