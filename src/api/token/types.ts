import type { UserCoinsCreated, UserInfoRes } from '../user/types'

interface Chain {
  id: number
  name: string
  logo: string
}

export interface TokenListItem extends UserCoinsCreated {
  twitter_url: string
  telegram_url: string
  website: string
  virtual_liquidity: string
  replies: string
  last_reply: null
  create_time: null
}

export interface TokenNewReq {
  name: string
  ticker: string
  desc: string
  image: string
  hash: string
  chain_id: string
  twitter_url?: string
  telegram_url?: string
  website?: string
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
}

export interface CreateTokenResult {
  name: string
  description: string
  image: string
}
