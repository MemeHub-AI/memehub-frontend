export interface InvitationCodeReq {
  invitationCode: string
}

export interface InvCount {
  count: number
}

export interface DiamondAddReq {
  token_address: string
  base_amount: string
  chain: string
  operation: string
}

export interface DiamondAddRes {
  reward_amount: number
}
