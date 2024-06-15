import { api, morkaApi } from '@/api'
import {
  AirdropItem,
  CommunityListItem,
  IdentityList,
  KolListItem,
  Query,
} from './type'
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
  getAirdrop(query: Query) {
    return api.GET<ApiResponse<Pagination<AirdropItem>>>(
      '/api/v1/airdrop/airdrop_list' + qs.stringify(query)
    )
  },
  getIdentityList() {
    return api.GET<ApiResponse<IdentityList>>('/api/v1/airdrop/identity')
  },
}
