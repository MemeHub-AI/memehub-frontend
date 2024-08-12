import { qs } from '@/hooks/use-fetch'
import { api } from '..'
import { ApiResponse, PaginationReq, PaginationRes } from '../types'
import {
  MemexTweetItem,
  MemexCreateReq,
  MemexTweetHash,
  MemexTweetComment,
} from './types'

export const memexApi = {
  getLatest: (req: PaginationReq) => {
    return api.GET<ApiResponse<PaginationRes<MemexTweetItem>>>(
      '/api/v1/memex/tweets' + qs.stringify(req)
    )
  },
  getHots: (req: PaginationReq) => {
    return api.GET<ApiResponse<PaginationRes<MemexTweetItem>>>(
      '/api/v1/memex/tweets/hot' + qs.stringify(req)
    )
  },
  getMyJoin: (req: PaginationReq) => {
    return api.GET<ApiResponse<PaginationRes<MemexTweetItem>>>(
      '/api/v1/memex/tweets/join' + qs.stringify(req)
    )
  },
  getMyIdea: (req: PaginationReq) => {
    return api.GET<ApiResponse<PaginationRes<MemexTweetItem>>>(
      '/api/v1/memex/tweets/my' + qs.stringify(req)
    )
  },
  getSuccessed: (req: PaginationReq) => {
    return api.GET<ApiResponse<PaginationRes<MemexTweetItem>>>(
      '/api/v1/memex/tweets/published' + qs.stringify(req)
    )
  },
  getTweetDetail: (hash: string) => {
    return api.GET<ApiResponse<MemexTweetItem>>(`/api/v1/memex/tweet/${hash}`)
  },
  createTweet: (req: MemexCreateReq) => {
    return api.POST<ApiResponse<MemexTweetHash>>('/api/v1/memex/tweets', {
      body: req,
    })
  },
  updateTweet: (req: MemexCreateReq & MemexTweetHash) => {
    return api.PUT<ApiResponse<null>>('/api/v1/memex/tweets', { body: req })
  },
  getTweetComments: (req: PaginationReq & MemexTweetHash) => {
    return api.GET<ApiResponse<PaginationRes<MemexTweetComment>>>(
      '/api/v1/memex/tweets/comments' + qs.stringify(req)
    )
  },
  addTweetComment: (req: MemexTweetHash & { content: string }) => {
    return api.POST('/api/v1/memex/tweets/comments', { body: req })
  },
}
