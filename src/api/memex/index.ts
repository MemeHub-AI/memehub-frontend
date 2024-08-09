import { CommonHeaders, qs } from '@/hooks/use-fetch'
import { api } from '..'
import { ApiResponse, PaginationRes, PostTweetData } from '../types'
import {
  GetListRes,
  MemexPaginationRes,
  PostsQuert,
  PostTweetRes,
} from './types'
import { useStorage } from '@/hooks/use-storage'
export const memexApi = {
  getPostList(req: PostsQuert) {
    return api.GET<ApiResponse<MemexPaginationRes<GetListRes>>>(
      '/api/v1/memex/tweets' + qs.stringify(req)
    )
  },

  postTweet(formData: PostTweetData) {
    const { getToken } = useStorage()
    return api.POST<ApiResponse<PostTweetRes>>('/api/v1/memex/tweets', {
      body: formData,
      headers: {
        [CommonHeaders.Authorization]: `Bearer ${getToken()}`,
      },
    })
  },
}
