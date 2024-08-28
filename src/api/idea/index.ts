import { api } from '..'
import { qs } from '@/utils/qs'
import type { ApiResponse, PaginationRes } from '../types'
import type { IdeaQuery, IdeaDataList, IdeaBasicInfo } from './type'

export const ideaApi = {
  getIdeaList: (id: string, query: IdeaQuery) => {
    return api.GET<ApiResponse<PaginationRes<IdeaDataList>>>(
      `/api/v1/news/idea/${id}/` + qs.stringify(query)
    )
  },
  getIdeaInfo: (id: string, query: IdeaQuery) => {
    return api.GET<ApiResponse<IdeaBasicInfo>>(
      `/api/v1/news/info/${id}/` + qs.stringify(query)
    )
  },
  getMemeStory: (id: string) => {
    return api.GET<ApiResponse<IdeaBasicInfo>>(`/api/v1/news/meme/${id}`)
  },
}
