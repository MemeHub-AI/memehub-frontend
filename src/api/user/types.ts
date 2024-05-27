import type { TokenCommentListRes, TokenListItem } from '../token/types'
import type { PaginationParams } from '../types'

export interface UserLoginReq {
  name?: string
  logo?: string
  description?: string
  wallet_address: string
  chain_id: string
  sign: string
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

export interface UserListReq extends PaginationParams {
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
  chain: {
    code: number
    message: string
    data: null
  }
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
}

export interface UserCoinsHeld {
  id: number
  amount: number
  coin: {
    id: number
    name: string
    ticker: string
    logo: string
  }
}
