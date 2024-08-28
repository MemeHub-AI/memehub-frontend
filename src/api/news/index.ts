import { api } from '..'
import { qs } from '@/utils/qs'
import type { ApiResponse, PaginationRes } from '../types'
import type {
  CountryData,
  MemeInfoDialogData,
  NewsData,
  NewsQuery,
  OpportunityData,
} from './types'

export const newsApi = {
  getNews: (query: NewsQuery) => {
    return api.GET<ApiResponse<PaginationRes<MemeInfoDialogData>>>(
      '/api/v1/news/' + qs.stringify(query)
    )
  },
  getCountry: () => {
    return api.GET<ApiResponse<CountryData[]>>('/api/v1/country/')
  },
  getOpportunity: (query: NewsQuery) => {
    return api.GET<ApiResponse<PaginationRes<OpportunityData>>>(
      '/api/v1/hotnews/' + qs.stringify(query)
    )
  },
  getNewsMeme: (query: NewsQuery) => {
    return api.GET<ApiResponse<PaginationRes<MemeInfoDialogData>>>(
      '/api/v1/news/meme/' + qs.stringify(query)
    )
  },
}
