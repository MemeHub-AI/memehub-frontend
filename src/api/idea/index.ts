import type { ApiResponse, Pagination } from '../types'
import { IdeaQuery, IdeaDataList, IdeaBasicInfo } from './type'
import { api } from '..'
import { qs } from '@/hooks/use-fetch'

export const ideaApi = {
  async getIdeaList(id: string, query: IdeaQuery) {
    return api.GET<ApiResponse<Pagination<IdeaDataList>>>(
      `/api/v1/news/idea/${id}/` + qs.stringify(query)
    )
  },
  async getIdeaInfo(id: string, query: IdeaQuery) {
    return api.GET<ApiResponse<IdeaBasicInfo>>(
      `/api/v1/news/info/${id}/` + qs.stringify(query)
    )
  },
}
