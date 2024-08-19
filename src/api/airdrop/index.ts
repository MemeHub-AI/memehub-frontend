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
}
