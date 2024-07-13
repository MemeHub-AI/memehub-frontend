import { Locale } from '../types'

export interface Query {
  page: number
  page_size?: number
  [property: string]: any
}

export interface KolListItem {
  id: number
  name: Locale
  logo: string
  description: string
  twitter_url: string
  telegram_group_url: string
  telegram_url: string
  evm_address: string
  sol_address: null | string
  ton_address: null | string
  ar_address: null | string
  communities: CommunityListItem[]
}

export interface CommunityListItem {
  id: number
  name: Locale
  logo: string
  description: string
  category: number
  identity: string
  chain: string
  contract_address: null | string
  contract_token_id: null | number
  influence: number
  related_link: null | number
  kol: KolListItem | null
}
