export interface AirdropMerkleRootReq {
  chain: string
  type_list: number[]
}

export interface AirdropMerkleRootRes {
  kol_hash: string
  community_hash: string
}
