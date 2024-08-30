import { api } from '..'
import { qs } from '@/utils/qs'
import { ApiResponse, PaginationRes, PaginationReq } from '../types'

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
  TokenCommentsReq,
  TokenLikereq,
  TokenListReq,
} from './types'

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
  getList: (req: TokenListReq & { search?: string }) => {
    return api.GET<ApiResponse<PaginationRes<TokenListItem>>>(
      '/api/v2/coin/list' + qs.stringify(req)
    )
  },
  getListByUser: (req: PaginationReq & { address?: string }) => {
    return api.GET<ApiResponse<PaginationRes<TokenListItem>>>(
      '/api/v2/coin/list-by-user' + qs.stringify(req)
    )
  },
  getIdoList: (req?: PaginationReq) => {
    return api.GET<ApiResponse<PaginationRes<TokenListItem>>>(
      '/api/v2/coin/ido-list' + qs.stringify(req)
    )
  },
  getDetail: (req: TokenDetailReq) => {
    return api.GET<ApiResponse<TokenListItem>>(
      '/api/v2/coin/detail' + qs.stringify(req)
    )
  },
  getComments: (req: TokenCommentsReq & PaginationReq) => {
    return api.GET<ApiResponse<PaginationRes<TokenCommentListRes>>>(
      `/api/v2/coin/comments` + qs.stringify(req)
    )
  },
  addComment: (req: TokenAddCommentReq) => {
    return api.POST<ApiResponse<TokenCommentListRes>>(
      '/api/v2/coin/comment/create',
      { body: req }
    )
  },
  like: (req: TokenLikereq) => {
    return api.POST<ApiResponse<TokenCommentListRes>>(
      '/api/v2/coin/comment/like',
      { body: req }
    )
  },
  searchTokens: (keyword: string) => {
    return api.GET<ApiResponse<OnchainTokensRes>>(
      '/api/v1/news/coinSearch/' + qs.stringify({ keyword })
    )
  },
}
