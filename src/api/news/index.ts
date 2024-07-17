import { qs } from '@/hooks/use-fetch'
import { api } from '..'

import type { ApiResponse, PaginationRes } from '../types'
import type {
  CountryData,
  MemeInfoDialogData,
  NewsData,
  NewsQuery,
  OpportunityData,
} from './types'

export const newsApi = {
  async getNews(query: NewsQuery) {
    return api.GET<ApiResponse<PaginationRes<MemeInfoDialogData>>>(
      '/api/v1/news/' + qs.stringify(query)
    )
  },
  async getCountry() {
    return api.GET<ApiResponse<CountryData[]>>('/api/v1/country/')
  },
  async getOpportunity(query: NewsQuery) {
    return api.GET<ApiResponse<PaginationRes<OpportunityData>>>(
      '/api/v1/hotnews/' + qs.stringify(query)
    )
  },

  async getNewsMeme(query: NewsQuery) {
    return api.GET<ApiResponse<PaginationRes<MemeInfoDialogData>>>(
      '/api/v1/news/meme/' + qs.stringify(query)
    )
  },
}
