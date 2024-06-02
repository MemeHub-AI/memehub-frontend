import { CommonHeaders } from '@/hooks/use-fetch'
import { api } from '..'
import { ApiResponse } from '../types'
import {
  AIEMemePosterData,
  AIMemeInfo,
  AIMemeInfoQuery,
  AIMemePosterQuery,
} from './type'

const headers = {
  [CommonHeaders.Authorization]: 'Bearer eyJ0eXAiOiJqd3QiLCJhbGciOiJIUzI1NiJ9',
}

export const aiApi = {
  getMemeInfo: async (data?: AIMemeInfoQuery, signal?: AbortSignal) => {
    return api.POST<ApiResponse<AIMemeInfo>>('/ai/meme-info', {
      body: data,
      signal: signal,
      headers,
    })
  },

  getMemeImage: async (data?: AIMemeInfo, signal?: AbortSignal) => {
    return api.POST<ApiResponse<string[]>>('/ai/meme-logo', {
      body: data,
      signal: signal,
      headers,
    })
  },

  getMemePoster: async (data?: AIMemePosterQuery, signal?: AbortSignal) => {
    return api.POST<ApiResponse<AIEMemePosterData>>('/ai/meme-poster', {
      body: data,
      signal: signal,
      headers,
    })
  },
}
