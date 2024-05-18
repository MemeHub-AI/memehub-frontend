export interface NewUserReq {
  name: string
  logo: string
  description: string
  wallet_address: string
  chain_id: string
  sign: string
}

export interface NewUserRes {
  token: string
}
