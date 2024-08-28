import { api } from '@/api'
import { qs } from '@/utils/qs'
import type {
  CommunityListItem,
  CommunityReq,
  KolListItem,
  Query,
} from './type'
import type {
  ApiResponse,
  PaginationReq,
  PaginationRes,
  SearchReq,
} from '../types'

export const allianceApi = {
  getKols: (query: Query & SearchReq) => {
    return api.GET<ApiResponse<PaginationRes<KolListItem>>>(
      '/api/v1/kol/list/' + qs.stringify(query)
    )
  },
  getCommunity: (query: Query & SearchReq) => {
    return api.GET<ApiResponse<PaginationRes<CommunityListItem>>>(
      '/api/v1/community/list/' + qs.stringify(query)
    )
  },
  getCommunityDetail: (query: CommunityReq) => {
    return api.GET<ApiResponse<CommunityListItem>>(
      '/api/v1/community/query' + qs.stringify(query)
    )
  },
  getKolCommunities: (query?: PaginationReq) => {
    return api.GET<ApiResponse<PaginationRes<CommunityListItem>>>(
      '/api/v1/kol/community' + qs.stringify(query)
    )
  },
}
