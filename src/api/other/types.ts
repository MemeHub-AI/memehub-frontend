export interface DiamondAddReq {
  token_address: string
  quote_amount: string
  chain: string
  operation: string
}

export interface DiamondAddRes {
  reward_amount: number
}

export interface GetContractRes {
  [k: string]: ContractItem[]
}

export interface ContractItem {
  id: number
  version: string
  chain: string
  bonding_curve: string
  distributor: string
  recommend: string
  description: string
  updated_at: string
  created_at: string
}
