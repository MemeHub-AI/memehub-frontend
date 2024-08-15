export interface MemexPostItem {
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
  status: PostStatus | null
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

export interface MemexListReq {
  type: MemexListType
  factory_address: string
}

export enum MemexListType {
  Latest = 'lastest',
  Hot = 'hot',
  Join = 'join',
  My = 'my',
  Published = 'published',
}

export enum PostStatus {
  Inactivated, // Created
  Activated, // Started
  Done, // Successed
}

export interface MemexCreateReq {
  chain: string
  content: string
  image_urls: string[]
  factory_address: string

  name?: string
  symbol?: string
  logo_url?: string
  description?: string
  twitter_url?: string
  telegram_url?: string
  website_url?: string
}

export interface MemexPostHash {
  hash: string
}

export interface MemexPostComment {
  content: string
  created_at: string
  user_logo: string
  user_name: string
  image_urls: string[]
}

export interface MemexPostCommentReq {
  content: string
  image_urls: string[]
}
