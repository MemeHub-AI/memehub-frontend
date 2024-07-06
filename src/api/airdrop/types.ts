import { Hash } from 'viem'

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
  name: string
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
  name: string
  ticker: string
  logo: string
  amount: number
  create: number
  address: string
  chain: string
  distribution_id: number
  community_name?: string
  community_logo?: string
  kol_name?: string
  kol_logo?: string
  airdrop_type: number
}
