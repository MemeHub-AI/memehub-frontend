import { qs } from '@/hooks/use-fetch'
import { api } from '..'
import { ApiResponse, PaginationReq, PaginationRes } from '../types'
import {
  MemexIdeaItem,
  MemexCreateReq,
  MemexIdeaHash,
  MemexIdeaComment,
  MemexIdeaCommentReq,
  MemexListReq,
  MemexIdeaCoinId,
} from './types'

export const memexApi = {
  getIdeaList: (req: PaginationReq & MemexListReq) => {
    return api.GET<ApiResponse<PaginationRes<MemexIdeaItem>>>(
      '/api/v1/memex/tweets/list' + qs.stringify(req)
    )
  },
  getMyIdeaList: (req: PaginationReq & MemexListReq) => {
    return api.GET<ApiResponse<PaginationRes<MemexIdeaItem>>>(
      '/api/v1/memex/tweets/user/list' + qs.stringify(req)
    )
  },
  getIdeaDetail: (hash: string) => {
    return api.GET<ApiResponse<MemexIdeaItem>>(`/api/v1/memex/tweet/${hash}`)
  },
  createIdea: (req: MemexCreateReq) => {
    return api.POST<ApiResponse<MemexIdeaHash & MemexIdeaCoinId>>(
      '/api/v1/memex/tweets/create',
      { body: req }
    )
  },
  updateIdea: (req: Partial<MemexCreateReq> & MemexIdeaHash) => {
    return api.PUT<ApiResponse<MemexIdeaCoinId>>(
      '/api/v1/memex/tweets/update',
      {
        body: req,
      }
    )
  },
  getIdeaComments: (req: PaginationReq & MemexIdeaHash) => {
    return api.GET<ApiResponse<PaginationRes<MemexIdeaComment>>>(
      '/api/v1/memex/tweets/comments/list' + qs.stringify(req)
    )
  },
  addIdeaComment: (req: MemexIdeaHash & MemexIdeaCommentReq) => {
    return api.POST('/api/v1/memex/tweets/comments/create', { body: req })
  },
}
