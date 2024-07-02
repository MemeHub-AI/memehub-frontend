import { ContractVersion } from '@/constants/contract'
import type { UserCoinsCreated, UserInfoRes } from '../user/types'

export interface TokenListItem extends UserCoinsCreated {
  twitter_url: string
  telegram_url: string
  website: string
  virtual_liquidity: string
  replies: string
  last_reply: null
  create_time: null
  hash: string
  explorer_tx: string
  version: string
}

export interface TokenNewReq {
  name: string
  ticker: string
  desc: string
  image: string
  hash: string
  chain: string
  version: ContractVersion
  twitter_url?: string
  telegram_url?: string
  website?: string
  coin_type?: CoinType
  marketing?: Marketing[]
}

export enum CoinType {
  Normal,
  Erc404,
  RewardLp,
  RewardHolder,
  Burning,
}

export interface Marketing {
  type: MarketType
  percent: number
}

export enum MarketType {
  Kol = 1,
  Community,
  Memehub,
}

export interface TokenNewRes {
  coin_id: number
}

export interface TokenUpdateReq {
  address: string
  hash: string
  status: TokenUpdateStatus
}

export enum TokenUpdateStatus {
  Failed,
  Success,
}

export interface TokenCommentListRes {
  id: number
  content: string
  user: UserInfoRes
  coin: number
  img: string
  related_comments: number[]
  created_at: string
  likes_count: number
  is_liked: boolean
}

export interface TokenAddCommentReq {
  coin: string
  content: string
  img?: string
  related_comments: string[]
  chain: string
}

export interface CreateTokenResult {
  name: string
  description: string
  image: string
}

export interface OnchainTokensRes {
  [k: string]: OnchainTokensChain
}

export interface OnchainTokensChain {
  logo: string
  number: number
  token: OnchainTokensItem[]
}

export interface OnchainTokensItem {
  name: string
  url: string
  symbol: string
  '24H_Volume': number
  logo: string
  publish_at: string
}
