import { ApiResponse, PaginationRes, PaginationReq } from '../types'
import {
  AirdropMerkleRootReq,
  AirdropMerkleRootRes,
  AirdropProofReq,
  AirdropProofRes,
  IdentityList,
  AirdropItem,
} from './types'

import { api } from '..'
import { qs } from '@/hooks/use-fetch'

export const airdropApi = {
  getList: (query: PaginationReq) => {
    return api.GET<ApiResponse<PaginationRes<AirdropItem>>>(
      '/api/v2/coin/airdrop-list' + qs.stringify(query)
    )
  },
  /** @deprecated */
  getMerkleRoot: (req: AirdropMerkleRootReq) => {
    return api.GET<ApiResponse<AirdropMerkleRootRes>>(
      '/api/v1/airdrop/generate_root/' + qs.stringify(req)
    )
  },
  /** @deprecated */
  getProof: (req: AirdropProofReq) => {
    return api.GET<ApiResponse<AirdropProofRes>>(
      '/api/v1/airdrop/get_proof/' + qs.stringify(req)
    )
  },
  /** @deprecated */
  getIdentityList: () => {
    return api.GET<ApiResponse<IdentityList>>('/api/v1/airdrop/identity')
  },
  getDetails: (req: Omit<AirdropProofReq, 'type_list'>) => {
    return api.GET<ApiResponse<AirdropItem[]>>(
      '/api/v1/airdrop/get_airdrop_detail/' + qs.stringify(req)
    )
  },
}
