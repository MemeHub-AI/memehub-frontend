export interface TokenListReq {
  page: string
  page_size: string
}

export interface TokenListRes {
  count: string
  next: null
  previous: null
  results: {
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
    creator: string
  }[]
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
