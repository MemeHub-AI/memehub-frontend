import { qs } from '@/hooks/use-fetch'
import { api } from '..'

import type { ApiResponse, Pagination } from '../types'
import type {
  CountryData,
  MemeInfoDialogData,
  NewsData,
  NewsQuery,
  OpportunityData,
} from './types'

export const newsApi = {
  async getNews(query: NewsQuery) {
    return api.GET<ApiResponse<Pagination<NewsData>>>(
      '/api/v1/news/' + qs.stringify(query)
    )
  },
  async getCountry() {
    return api.GET<ApiResponse<CountryData[]>>('/api/v1/country/')
  },
  async getOpportunity(query: NewsQuery) {
    return api.GET<ApiResponse<Pagination<OpportunityData>>>(
      '/api/v1/hotnews/' + qs.stringify(query)
    )
  },

  async getNewsMeme(query: NewsQuery) {
    return api.GET<ApiResponse<Pagination<MemeInfoDialogData>>>(
      '/api/v1/news/meme/' + qs.stringify(query)
    )
  },
}
