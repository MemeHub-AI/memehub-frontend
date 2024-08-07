import type { ApiResponse, PaginationRes } from '../types'
import { IdeaQuery, IdeaDataList, IdeaBasicInfo, MemeStoryData } from './type'
import { api } from '..'
import { qs } from '@/hooks/use-fetch'

export const ideaApi = {
  async getIdeaList(id: string, query: IdeaQuery) {
    return api.GET<ApiResponse<PaginationRes<IdeaDataList>>>(
      `/api/v1/news/idea/${id}/` + qs.stringify(query)
    )
  },
  async getIdeaInfo(id: string, query: IdeaQuery) {
    return api.GET<ApiResponse<IdeaBasicInfo>>(
      `/api/v1/news/info/${id}/` + qs.stringify(query)
    )
  },
  async getMemeStory(id: string) {
    return api.GET<ApiResponse<IdeaBasicInfo>>(`/api/v1/news/meme/${id}`)
  },
}
