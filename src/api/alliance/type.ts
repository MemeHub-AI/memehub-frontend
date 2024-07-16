export interface Query {
  page: number
  page_size?: number
}

export interface KolListItem {
  description: string
  id: string
  logo: string
  name: string
  telegram_group_url: string
  telegram_url: string
  twitter_url: string
  communities: CommunityListItem[]
}

export interface CommunityListItem {
  description: string
  id: string
  logo: string
  name: string
}
