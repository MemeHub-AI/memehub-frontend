import { DistributorVersion } from '@/contract/abi/distributor'
import { TokenVersion } from '@/contract/abi/token'
import { Marketing } from '../token/types'
import { MemexFactoryVersion } from '@/contract/abi/memex/factory'
import { BcVersion } from '@/contract/abi/bonding-curve'

export interface MemexIdeaItem {
  user_logo: string
  user_name: string
  created_at: string
  image_urls: string[]
  user_address: string
  ido_address: string
  contract_address: null | string
  content: string
  chain: string
  name: string | null
  symbol: string | null
  description: string | null
  logo_url: string | null
  twitter_url: string | null
  telegram_url: string | null
  website_url: string | null
  hash: string
  status: number
  comment_count: number
  like_amount: number
  is_creator: boolean
  is_liked: boolean
  factory_address: string
  airdrop_address: string
  coin_version: TokenVersion
  airdrop_version: DistributorVersion
  memex_version: MemexFactoryVersion
  coin_factory_address: string
  airdrop_marketing: Marketing[] | undefined
  published_at: null | string
  bond_version: BcVersion
  bond_address: string
}

export interface MemexListReq {
  type: MemexListType
}

export enum MemexListType {
  Latest = 'lastest',
  Hot = 'hot',
  Join = 'join',
  My = 'my',
  Published = 'published',
}

export enum IdeaStatus {
  Inactivated, // Created
  Activated, // Started
  Done, // Successed
}

export interface MemexCreateReq {
  chain: string
  content: string
  image_urls: string[]
  airdrop_marketing: Marketing[] | undefined

  factory_address: string
  airdrop_address: string
  coin_factory_address: string

  name?: string
  symbol?: string
  logo_url?: string
  description?: string
  twitter_url?: string
  telegram_url?: string
  website_url?: string
}

export interface MemexIdeaHash {
  hash: string
}

export interface MemexIdeaCoinId {
  coin_id: string | null
}

export interface MemexIdeaComment {
  content: string
  created_at: string
  user_logo: string
  user_name: string
  image_urls: string[]
}

export interface MemexIdeaCommentReq {
  content: string
  image_urls: string[]
}
