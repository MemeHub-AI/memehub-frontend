import { ApiResponse, api } from '..'

import { NewsList } from './types'

export const newsApi = {
  async getNews() {
    return api.GET<NewsList[]>('/api/v1/news/')
  },
}
