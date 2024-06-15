import { api } from '@/api'
import { CommunityListItem, KolListItem, Query } from './type'
import { qs } from '@/hooks/use-fetch'
import { ApiResponse, Pagination } from '../types'

export const allianceApi = {
  async getKols(query: Query) {
    return api.GET<ApiResponse<Pagination<KolListItem>>>(
      '/api/v1/kol/list/' + qs.stringify(query)
    )
  },
  getCommunity(query: Query) {
    return api.GET<ApiResponse<Pagination<CommunityListItem>>>(
      '/api/v1/community/list/' + qs.stringify(query)
    )
  },
}
