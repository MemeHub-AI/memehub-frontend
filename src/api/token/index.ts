import { ApiResponse, api } from '..'
import { qs } from '@/hooks/use-fetch'

import type {
  TokenListReq,
  TokenListRes,
  TokenNewReq,
  TokenNewRes,
  TokenUpdateReq,
  TokenListItem,
  TokenCommentListRes,
  TokenAddCommentReq,
} from './types'
import { Pagination } from '../types'
import { utilTime } from '@/utils/time'

export const tokenApi = {
  list(req: TokenListReq) {
    return api.GET<ApiResponse<TokenListRes>>(
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
  commentList(id: string) {
    return api.GET<ApiResponse<Pagination<TokenCommentListRes>>>(
      `/api/v1/coin/comments/${id}/`
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
  generateInfo() {
    const data = {
      data: {
        name: 'BabyPEPE',
        description: 'Use AI to create a memecoin with the theme of BabyPEPE?',
        image:
          'https://s3.ap-east-1.amazonaws.com/storage.memehub.ai/pepe-ad9f3a5d0ceb9ca1c171603bb53d9708.avif',
      },
    }
    return new Promise<typeof data>(async (resolve) => {
      await utilTime.wait(2000)
      resolve(data)
    })

    return api.GET<ApiResponse<any>>('/api/v1/coin/coins/generate/')
  },
}
