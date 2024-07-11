import { Locale } from '../types'

export interface Query {
  page: number
  page_size?: number
  [property: string]: any
}

export interface KolListItem {
  description: string
  id: string
  logo: string
  name: Locale
  telegram_group_url: string
  telegram_url: string
  twitter_url: string
}

export interface CommunityListItem {
  description: string
  id: string
  logo: string
  name: Locale
}
