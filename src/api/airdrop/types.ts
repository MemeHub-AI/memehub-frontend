import { Hash } from 'viem'
import { Locale } from '../types'
import { TokenVersion } from '@/contract/abi/token'
import { DistributorVersion } from '@/contract/abi/distributor'

export interface AirdropMerkleRootReq {
  chain: string
  type_list: string
}

export interface AirdropMerkleRootRes {
  kol_count: number
  community_count: number
  kol_root_hash: Hash
  community_root_hash: Hash
}

export interface AirdropProofReq {
  type_list: string
  chain: string
  token_address: string
}

export interface AirdropProofRes {
  kol_proof: Hash[]
  community_proof: Hash[]
}

export interface IdentityList {
  kol?: Kol
  community?: Community[]
}

export interface Kol {
  id: number
  name: Locale
  logo: string
  description: string
}

export interface Community extends Kol {
  category: CommunityCategory
}

export enum CommunityCategory {
  Chat = 1,
  Nft,
  Token,
}

export interface AirdropItem {
  airdrop: AirdropDetail[]
  airdrop_address: string
  airdrop_index: number
  airdrop_supply: string
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
  graduated_master: null | string
  graduated_pool: null | string
  graduated_token: null | string
  hash: null | string
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

export interface AirdropDetail {
  contract: string
  distribution_id: number
  is_all: boolean
  type: AirdropDetailType
}

export enum AirdropDetailType {
  Kol = 'kol',
  Community = 'community',
}
