import { ApiResponse, api } from '..'
import { AIMemeInfo, AIMemeInfoQuery } from './type'

export const aiApi = {
  getMemeInfo: async (data?: AIMemeInfoQuery) => {
    return api.POST<ApiResponse<AIMemeInfo>>('/ai/meme-info', {
      body: data,
    })
  },

  getMemeImage: async (data?: AIMemeInfo) => {
    return api.POST<ApiResponse<string[]>>('/ai/meme-logo', {
      body: data,
    })
  },
}
