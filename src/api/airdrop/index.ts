import { api } from '..'
import { qs } from '@/utils/qs'
import type { ApiResponse, PaginationRes, PaginationReq } from '../types'
import type { AirdropItem } from './types'

export const airdropApi = {
  getList: (query: PaginationReq) => {
    return api.GET<ApiResponse<PaginationRes<AirdropItem>>>(
      '/api/v2/coin/airdrop-list' + qs.stringify(query)
    )
  },
}
