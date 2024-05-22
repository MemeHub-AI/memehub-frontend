import { TokenCommentListRes, TokenListItem } from '../token/types'

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
  user: UserMyInfoRes
}

export interface UserUpdateReq {
  name: string
  logo: string
  description: string
  wallet_address: string
}

export interface UserInfoRes {
  id: number
  name: string
  logo: string
  description: string
  wallet_address: string
  followers: UserMyInfoFollow[]
  following: UserMyInfoFollow[]
  like_count: number
  mention_count: number
}

export interface UserMyInfoRes extends UserInfoRes {
  coins_held: []
  coins_created: TokenListItem[]
  replies: TokenCommentListRes[]
  notifications: UserMyInfoNotify[]
}

export interface UserMyInfoFollow {
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
