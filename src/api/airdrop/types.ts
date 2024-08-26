import { Hash } from 'viem'
import { Locale } from '../types'
import { TokenListItem } from '../token/types'

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

export interface AirdropItem extends TokenListItem {}

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
