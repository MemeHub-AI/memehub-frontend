export interface MemexTweetItem {
  chain: null | string
  comment_count: number
  content: string
  contract_address: null | string
  created_at: string
  description: null
  hash: null | string
  ido_address: null | string
  image_urls: string[]
  logo_url: null
  name: null | string
  status: TweetStatus | null
  symbol: null | string
  telegram_url: null
  twitter_url: null | string
  user_address: string
  user_logo: string
  user_name: string
  website_url: null
  is_creator: number
  is_liked: number
  like_amount: number
}

export enum TweetStatus {
  Inactivated, // Already tweet
  Activated, // Start ido
  Done, // Alread ido
}

export interface MemexCreateReq {
  chain: string
  content: string
  image_urls: string[]

  name?: string
  symbol?: string
  logo_url?: string
  description?: string
  twitter_url?: string
  telegram_url?: string
  website_url?: string
}

export interface MemexTweetHash {
  hash: string
}

export interface MemexTweetComment {
  content: string
  created_at: string
  user_logo: string
  user_name: string
}
