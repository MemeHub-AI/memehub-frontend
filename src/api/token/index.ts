import { api } from '..'
import { qs } from '@/hooks/use-fetch'

import type {
  TokenCreateReq,
  TokenUpdateReq,
  TokenListItem,
  TokenCommentListRes,
  TokenAddCommentReq,
  OnchainTokensRes,
  TokenConfigRes,
  TokenCreateRes,
  TokenDetailReq,
} from './types'
import { ApiResponse, PaginationRes, PaginationReq } from '../types'

export const tokenApi = {
  getConfig: () => {
    return api.GET<ApiResponse<TokenConfigRes>>('/api/v2/coin/configure')
  },
  createToken: (req: TokenCreateReq) => {
    return api.POST<ApiResponse<TokenCreateRes>>('/api/v2/coin/create', {
      body: req,
    })
  },
  updateToken: (addr: string, req: TokenUpdateReq) => {
    return api.PATCH<ApiResponse<null>>(`/api/v1/coin/coins/${addr}/`, {
      body: req,
    })
  },
  getList: (req: PaginationReq & { token?: string }) => {
    return api.GET<ApiResponse<PaginationRes<TokenListItem>>>(
      '/api/v2/coin/list' + qs.stringify(req)
    )
  },
  getDetail: (req: TokenDetailReq) => {
    return api.GET<ApiResponse<TokenListItem>>(
      '/api/v2/coin/detail' + qs.stringify(req)
    )
  },
  getComments: (chain: string, addr: string, req: PaginationReq) => {
    return api.GET<ApiResponse<PaginationRes<TokenCommentListRes>>>(
      `/api/v1/coin/comments/${chain}/${addr}/` + qs.stringify(req)
    )
  },
  addComment: (req: TokenAddCommentReq) => {
    return api.POST<ApiResponse<TokenCommentListRes>>(
      '/api/v1/coin/comments/',
      { body: req }
    )
  },
  addLike: (addr: string) => {
    return api.POST<ApiResponse<TokenCommentListRes>>(
      `/api/v1/coin/like/${addr}/`
    )
  },
  removeLike: (addr: string) => {
    return api.DELETE<ApiResponse<TokenCommentListRes>>(
      `/api/v1/coin/like/${addr}/`
    )
  },
  searchTokens: (keyword: string) => {
    return api.GET<ApiResponse<OnchainTokensRes>>(
      '/api/v1/news/coinSearch/' + qs.stringify({ keyword })
    )
  },
}
