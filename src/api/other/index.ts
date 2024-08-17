import { api } from '..'

import { CommonHeaders, ContentType } from '@/hooks/use-fetch'
import { ApiResponse } from '../types'
import { GetContractRes } from './types'

export const otherApi = {
  uploadImage: (formData: FormData) => {
    return api.POST<ApiResponse<{ image_url: string }>>('/api/v1/upload/', {
      body: formData,
      headers: {
        [CommonHeaders.ContentType]: ContentType.FormData,
      },
    })
  },
  getContracts: () => {
    return api.GET<ApiResponse<GetContractRes>>('/api/v1/contract/')
  },
}
