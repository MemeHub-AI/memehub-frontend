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
