import type { PaginationReq } from '../types'

export interface UserLoginReq {
  name?: string
  logo?: string
  description?: string
  wallet_address: string
  chain_id: string
  sign: string
  timestamp: string
}

export interface UserLoginRes {
  token: string
  user: UserInfoRes
}

export interface UserUpdateReq {
  name?: string
  logo?: string
  description?: string
  wallet_address?: string
}

export interface UserInfoRes {
  id: number
  name: string
  logo: string
  description: string
  wallet_address: string
  like_count: number
  mention_count: number
  is_follower: boolean
  reward_amount: number
}

export interface UserMyInfoFollow {
  id: number
  name: string
  logo: string
  follower_count: number
}

export interface UserMyInfoNotify {
  id: number
  content: string
  user: {
    id: number
    name: string
    logo: string
  }
  coin: number
  img: string
  related_comments: number[]
  created_at: string
  likes_count: number
  is_liked: boolean
}

export enum UserListType {
  CoinsCreated = 1,
  Replies,
  Notifications,
  Followers,
  Following,
  CoinsHeld,
}

export interface UserListReq extends PaginationReq {
  type: UserListType
}

export interface UserListRes {
  [UserListType.CoinsHeld]: UserCoinsHeld
  [UserListType.CoinsCreated]: UserCoinsCreated
  [UserListType.Replies]: UserReplies
  [UserListType.Notifications]: UserNotification
  [UserListType.Followers]: UserFollow
  [UserListType.Following]: UserFollow
}

interface User {
  id: number
  name: string
  logo: string
  description: string
  wallet_address: string
  like_count: number
  mention_count: number
}

export interface Chain {
  id: string
  name: string
  logo: string
  native: {
    decimals: number
    name: string
    symbol: string
  }
  explorer: string
  explorer_tx: string
}

export interface UserCoinsCreated {
  id: number
  image: string
  address: string
  ticker: string
  creator: User
  name: string
  desc: string
  market_cap: number
  total_replies: number
  chain: Chain
}

export interface UserReplies {
  id: number
  content: string
  user: User
  coin: number
  img: string
  related_comments: number[]
  created_at: string
  likes_count: number
  is_liked: boolean
}

export interface UserNotification {
  id: number
  content: string
  user: User
  coin: number
  img: string
  related_comments: number[]
  created_at: string
  likes_count: number
  is_liked: boolean
}

export interface UserFollow {
  id: number
  name: string
  logo: string
  follower_count: number
  user: User
}

export interface UserCoinsHeld {
  id: number
  amount: number
  coin: UserCoinsCreated
  chain: Chain
}
