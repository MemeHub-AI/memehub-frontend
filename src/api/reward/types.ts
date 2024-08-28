export interface RewardInfoRes {
  buy: RewardInfoTrade
  sell: RewardInfoTrade
  create: RewardInfoBase
  graduated: RewardInfoBase
  join_community: RewardInfoBase
  memex_created: RewardInfoBase
  memex_launched: RewardInfoBase
  memex_liked: RewardInfoBase
  trade: RewardInfoBase
}

export interface RewardInfoTrade {
  amount_unit: number
  desc: string
  usd_unit: number
}

export interface RewardInfoBase {
  desc: string
  reward_amount: number
}
