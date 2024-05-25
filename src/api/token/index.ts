import { api } from '..'
import { qs } from '@/hooks/use-fetch'

import type {
  TokenNewReq,
  TokenNewRes,
  TokenUpdateReq,
  TokenListItem,
  TokenCommentListRes,
  TokenAddCommentReq,
} from './types'
import { ApiResponse, Pagination, PaginationParams } from '../types'

export const tokenApi = {
  list(req: PaginationParams) {
    return api.GET<ApiResponse<Pagination<TokenListItem>>>(
      '/api/v1/coin/coinslist/' + qs.stringify(req)
    )
  },
  create(req: TokenNewReq) {
    return api.POST<ApiResponse<TokenNewRes>>('/api/v1/coin/coins/', {
      body: req,
    })
  },
  update(id: string | number, req: TokenUpdateReq) {
    return api.PATCH<null>(`/api/v1/coin/coins/${id}/`, { body: req })
  },
  details(id: string | number) {
    return api.GET<ApiResponse<TokenListItem>>(`/api/v1/coin/coins/${id}/`)
  },
  commentList(id: string, req: PaginationParams) {
    return api.GET<ApiResponse<Pagination<TokenCommentListRes>>>(
      `/api/v1/coin/comments/${id}/` + qs.stringify(req)
    )
  },
  addComment(req: TokenAddCommentReq) {
    return api.POST<ApiResponse<TokenCommentListRes>>(
      '/api/v1/coin/comments/',
      {
        body: req,
      }
    )
  },
  like(id: string) {
    return api.POST<ApiResponse<TokenCommentListRes>>(
      `/api/v1/coin/like/${id}/`
    )
  },
  unlike(id: string) {
    return api.DELETE<ApiResponse<TokenCommentListRes>>(
      `/api/v1/coin/like/${id}/`
    )
  },
}
