export interface PostsQuert {
  page: string
  size: string
}

export interface GetListRes {
  user_logo: string
  user_name: string
  created_at: string
  image_urls: string[]
  user_address: string
  ido_address: string | null
  contract_address: string | null
  content: string
  chain: string | null
  name: string | null
  symbol: string | null
  description: null
  logo_url: null
  twitter_url: string | null
  telegram_url: null
  website_url: null
  hash: string | null
  status: number | null
  comment_count: number
}

export interface MemexPaginationRes<T> {
  count: number
  next: null
  previous: null
  results?: T[]
}

export interface PostTweetRes {
  hash: string
}
