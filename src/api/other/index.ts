import { api } from '..'

import { CommonHeaders, ContentType } from '@/hooks/use-fetch'
import { ApiResponse } from '../types'

export const otherApi = {
  uploadImage(formData: FormData) {
    return api.POST<ApiResponse<{ image_url: string }>>('/api/v1/upload/', {
      body: formData,
      headers: {
        [CommonHeaders.ContentType]: ContentType.FormData,
      },
    })
  },
}
