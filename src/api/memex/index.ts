import { qs } from '@/hooks/use-fetch'
import { api } from '..'
import { ApiResponse, PaginationReq, PaginationRes } from '../types'
import {
  MemexPostItem,
  MemexCreateReq,
  MemexPostHash,
  MemexPostComment,
  MemexPostCommentReq,
  MemexListReq,
} from './types'

export const memexApi = {
  getPostList: (req: PaginationReq & MemexListReq) => {
    return api.GET<ApiResponse<PaginationRes<MemexPostItem>>>(
      '/api/v1/memex/tweets' + qs.stringify(req)
    )
  },
  getPostDetail: (hash: string) => {
    return api.GET<ApiResponse<MemexPostItem>>(`/api/v1/memex/tweet/${hash}`)
  },
  createPost: (req: MemexCreateReq) => {
    return api.POST<ApiResponse<MemexPostHash>>('/api/v1/memex/tweets', {
      body: req,
    })
  },
  updatePost: (req: Partial<MemexCreateReq> & MemexPostHash) => {
    return api.PUT<ApiResponse<MemexPostHash>>('/api/v1/memex/tweets', {
      body: req,
    })
  },
  getPostComments: (req: PaginationReq & MemexPostHash) => {
    return api.GET<ApiResponse<PaginationRes<MemexPostComment>>>(
      '/api/v1/memex/tweets/comments' + qs.stringify(req)
    )
  },
  addPostComment: (req: MemexPostHash & MemexPostCommentReq) => {
    return api.POST('/api/v1/memex/tweets/comments', { body: req })
  },
}
