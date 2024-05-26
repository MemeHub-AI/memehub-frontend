import { api } from '..'

import type { ApiResponse, Pagination } from '../types'
import type { CountryData, NewsData } from './types'

export const newsApi = {
  async getNews() {
    return api.GET<ApiResponse<Pagination<NewsData>>>('/api/v1/news/')
  },
  async getCountry() {
    return api.GET<ApiResponse<CountryData[]>>('/api/v1/country/')
  },
}
