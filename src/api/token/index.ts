import { api } from '..'
import { qs } from '@/hooks/use-fetch'

import type {
  TokenNewReq,
  TokenUpdateReq,
  TokenListItem,
  TokenCommentListRes,
  TokenAddCommentReq,
  OnchainTokensRes,
} from './types'
import { ApiResponse, PaginationRes, PaginationReq } from '../types'

export const tokenApi = {
  list(req: PaginationReq & { token?: string }) {
    return api.GET<ApiResponse<PaginationRes<TokenListItem>>>(
      '/api/v1/coin/coinslist/' + qs.stringify(req)
    )
  },
  create(req: TokenNewReq) {
    return api.POST<ApiResponse<TokenListItem>>('/api/v1/coin/coins/', {
      body: req,
    })
  },
  update(addr: string, req: TokenUpdateReq) {
    return api.PATCH<ApiResponse<null>>(`/api/v1/coin/coins/${addr}/`, {
      body: req,
    })
  },
  details(chain: string, addr: string) {
    return api.GET<ApiResponse<TokenListItem>>(
      `/api/v1/coin/coins/${chain}/${addr}`
    )
  },
  commentList(chain: string, addr: string, req: PaginationReq) {
    return api.GET<ApiResponse<PaginationRes<TokenCommentListRes>>>(
      `/api/v1/coin/comments/${chain}/${addr}/` + qs.stringify(req)
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
  onchainTokens(keyword: string) {
    return api.GET<ApiResponse<OnchainTokensRes>>(
      '/api/v1/news/coinSearch/' + qs.stringify({ keyword })
    )
  },
}
