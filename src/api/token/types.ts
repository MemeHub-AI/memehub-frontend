import { TokenType } from '@/enums/token'
import type { TokenVersion } from '@/contract/abi/token'
import type { DistributorVersion } from '@/contract/abi/distributor'
import type { AirdropDetail } from '../airdrop/types'
import type { MemexFactoryVersion } from '@/contract/abi/memex/factory'
import type { RecommendVersion } from '@/contract/abi/recommend'
import type { BcVersion } from '@/contract/abi/bonding-curve'

export type TokenListQueryKey = 'page' | 'page_size' | 'orderby'

export type TokenListReq = [TokenListQueryKey, string][]

export interface TokenListItem {
  airdrop: AirdropDetail[]
  airdrop_address: string
  airdrop_index: number | null
  airdrop_supply: string
  /**
   * 1: Only select community
   * 2: Only all community
   * 4: Only select KOL
   * 5: Select community & KOL
   * 6: All community & select KOL
   * 8: Only all KOL
   * 9: All KOL & select community
   * 10: All KOL & community
   */
  bond_address: string
  bond_version: BcVersion
  airdrop_type: number
  airdrop_version: DistributorVersion
  chain: string
  coin_type: number
  coin_version: TokenVersion
  contract_address: string
  created_at: string
  creator_address: string
  description: string
  factory_address: string
  graduated_eth: null
  graduated_master: null
  graduated_pool: null
  graduated_token: null
  hash: string
  id: string
  image_url: string
  is_active: boolean
  is_graduated: boolean
  max_supply: string
  name: string
  network: string
  poster_urls: string[]
  start_price: string
  symbol: string
  telegram_url: string
  total_supply: string
  twitter_url: string
  updated_at: string
  website_url: string
}

export interface TokenCreateReq {
  chain: string
  name: string
  symbol: string
  description: string
  image_url: string
  poster_urls?: string[]
  twitter_url?: string
  telegram_url?: string
  website_url?: string
  factory_address: string
  airdrop_address: string
  coin_type?: TokenType

  // Only used for frontend
  marketing?: Marketing[]
}

export interface TokenCreateRes {
  id: string
  created_at: string
  updated_at: string
  chain: string
  hash: null | string
  name: string
  symbol: string
  description: string
  image_url: string
  poster_urls: string[]
  twitter_url: string
  telegram_url: string
  website_url: string
  creator_address: string
  factory_address: string
  contract_address: null | string
  airdrop_address: string
  airdrop_index: null
  airdrop_supply: string
  max_supply: string
  total_supply: string
  start_price: string
  coin_type: number
  is_active: boolean
}

export interface TokenDetailReq {
  id?: string
  chain?: string
  address?: string
}

export interface Marketing {
  type: MarketType
  percent: number
}

export enum MarketType {
  Kol = 1,
  Community,
  Memehub,
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
  replies_count: number
  likes_count: number
  liked: boolean
  comment_type: string
  created_at: string
  updated_at: string
  content: string
  images: string[]
  videos: string | null
  user: {
    id: number
    name: string
    logo: string
    description: string
    wallet_address: string
  }
  coin: string
  related_head: string | null
  related_comment: string | null
}

export interface TokenAddCommentReq {
  id?: string
  chain: string
  address: string
  content: string
  images: string[]
  related_comment: number | null
}

export interface CreateTokenResult {
  name: string
  description: string
  image: string
}

export interface OnchainTokensRes {
  [k: string]: OnchainTokensChain
}

export interface OnchainTokensChain {
  logo: string
  number: number
  token: OnchainTokensItem[]
}

export interface OnchainTokensItem {
  name: string
  url: string
  symbol: string
  '24H_Volume': number
  logo: string
  publish_at: string
}

export interface TokenConfigRes {
  name: string
  value: TokenCreateConfigValue
  contracts: TokenConfigContracts
}

export interface TokenConfigContracts {
  bond: TokenConfigContract<BcVersion>[]
  coin: TokenConfigContract<TokenVersion>[]
  airdrop: TokenConfigContract<DistributorVersion>[]
  recommend: TokenConfigContract<RecommendVersion>[]
  memex: TokenConfigContract<MemexFactoryVersion>[]
}

export interface TokenCreateConfigValue {
  distributionRatioKol: number
  distributionRatioCommunity: number
  walletCountKol: number
  walletCountCommunity: number
  kolFlag: number
  CommunityFlag: number
}

export interface TokenConfigContract<
  T extends string = string,
  V extends string = string
> {
  chain: string
  creator: string
  category: number
  address: T
  version: V
}

export interface TokenCommentsReq {
  id?: string
  chain?: string
  address?: string
  comment_id?: number
  reverse_time?: boolean
  by_hot?: boolean
  flatten?: boolean
}

export interface TokenLikereq {
  comment_id: number
  like: boolean
}
