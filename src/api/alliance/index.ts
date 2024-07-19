import { api } from '@/api'
import { CommunityListItem, KolListItem, Query } from './type'
import { qs } from '@/hooks/use-fetch'
import { ApiResponse, PaginationRes, SearchReq } from '../types'

export const allianceApi = {
  async getKols(query: Query & SearchReq) {
    return api.GET<ApiResponse<PaginationRes<KolListItem>>>(
      '/api/v1/kol/list/' + qs.stringify(query)
    )
  },
  getCommunity(query: Query & SearchReq) {
    return api.GET<ApiResponse<PaginationRes<CommunityListItem>>>(
      '/api/v1/community/list/' + qs.stringify(query)
    )
  },
}
