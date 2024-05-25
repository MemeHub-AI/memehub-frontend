import { ApiResponse, api } from '..'
import { Pagination } from '../types'

import { NewsData } from './types'

export const newsApi = {
  async getNews() {
    return api.GET<ApiResponse<Pagination<NewsData>>>('/api/v1/news/')
  },
}
