import { CommonHeaders, ContentType } from '@/hooks/use-fetch'
import { type ApiResponse, api } from '..'

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
