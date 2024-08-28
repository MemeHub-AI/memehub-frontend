import { api } from '..'
import { ApiResponse } from '../types'
import {
  AIEMemePosterData,
  AIMemeInfo,
  AIMemeInfoQuery,
  AIMemePosterQuery,
} from './type'

export const aiApi = {
  getMemeInfo: async (data?: AIMemeInfoQuery, signal?: AbortSignal) => {
    return api.POST<ApiResponse<AIMemeInfo>>('/ai/meme-info', {
      body: data,
      signal: signal,
    })
  },

  getMemeImage: async (data?: AIMemeInfo, signal?: AbortSignal) => {
    return api.POST<ApiResponse<{ images: string[] }>>('/ai/meme-logo', {
      body: data,
      signal: signal,
    })
  },

  getMemePoster: async (data?: AIMemePosterQuery, signal?: AbortSignal) => {
    return api.POST<ApiResponse<AIEMemePosterData>>('/ai/meme-poster', {
      body: data,
      signal: signal,
    })
  },
}
