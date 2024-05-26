import { ApiResponse, api } from '..'
import { Pagination } from '../types'

import { CountryData, NewsData } from './types'

export const newsApi = {
  async getNews() {
    return api.GET<ApiResponse<Pagination<NewsData>>>('/api/v1/news/')
  },
  async getCountry() {
    return api.GET<ApiResponse<CountryData[]>>('/api/v1/country/')
  },
}
