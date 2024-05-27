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
  update(addr: string, req: TokenUpdateReq) {
    return api.PATCH<null>(`/api/v1/coin/coins/${addr}/`, { body: req })
  },
  details(addr: string) {
    return api.GET<ApiResponse<TokenListItem>>(`/api/v1/coin/coins/${addr}/`)
  },
  commentList(addr: string, req: PaginationParams) {
    return api.GET<ApiResponse<Pagination<TokenCommentListRes>>>(
      `/api/v1/coin/comments/${addr}/` + qs.stringify(req)
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
  like(addr: string) {
    return api.POST<ApiResponse<TokenCommentListRes>>(
      `/api/v1/coin/like/${addr}/`
    )
  },
  unlike(addr: string) {
    return api.DELETE<ApiResponse<TokenCommentListRes>>(
      `/api/v1/coin/like/${addr}/`
    )
  },
}
