export interface TokenListReq {
  page: string
  size: string
}

export interface TokenListRes {
  count: string
  next: null
  previous: null
  results: TokenListItem[]
}

export interface TokenListItem {
  id: string
  address: string
  name: string
  ticker: string
  desc: string
  image: string
  twitter_url: string
  telegram_url: string
  website: string
  market_cap: string
  virtual_liquidity: string
  replies: string
  last_reply: null
  create_time: null
  creator: {
    id: number
    name: string
    logo: string
  }
}

export interface TokenNewReq {
  name: string
  ticker: string
  desc: string
  image: string
  twitter_url: string
  telegram_url: string
  website: string
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
  user: {
    id: number
    name: string
    logo: string
  }
  coin: number
  img: string
  related_comments: string[]
  created_at: string
  likes_count: number
  is_liked: boolean
}

export interface TokenAddCommentReq {
  coin: string
  content: string
  img?: string
  related_comments: number[]
}
