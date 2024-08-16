import { TokenType } from '@/enums/token'
import type { UserInfoRes } from '../user/types'
import { TokenVersion } from '@/contract/abi/token'
import { DistributorVersion } from '@/contract/abi/distributor'
import { AirdropDetail } from '../airdrop/types'

export interface TokenListItem {
  airdrop: AirdropDetail[]
  airdrop_address: string
  airdrop_index: number
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
  content: string
  user: UserInfoRes
  coin: number
  img: string
  related_comments: number[]
  created_at: string
  likes_count: number
  is_liked: boolean
}

export interface TokenAddCommentReq {
  coin: string
  content: string
  img?: string
  related_comments: string[]
  chain: string
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
  value: TokenConfigValue
  contracts: {
    coin: TokenConfigContract[]
    airdrop: TokenConfigContract[]
  }
}

interface TokenConfigValue {
  distributionRatioKol: number
  distributionRatioCommunity: number
  walletCountKol: number
  walletCountCommunity: number
  kolFlag: number
  CommunityFlag: number
}

interface TokenConfigContract {
  chain: string
  creator: string
  address: string
  category: number
  version: string
}
