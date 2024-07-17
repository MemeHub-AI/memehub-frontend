import { api } from '..'

import { CommonHeaders, ContentType, qs } from '@/hooks/use-fetch'
import { ApiResponse } from '../types'
import { DiamondAddReq, DiamondAddRes, GetContractRes } from './types'

export const otherApi = {
  uploadImage(formData: FormData) {
    return api.POST<ApiResponse<{ image_url: string }>>('/api/v1/upload/', {
      body: formData,
      headers: {
        [CommonHeaders.ContentType]: ContentType.FormData,
      },
    })
  },
  getDiamondAmount(req: DiamondAddReq) {
    return api.GET<ApiResponse<DiamondAddRes>>(
      '/api/v1/airdrop/get_reward_amount/' + qs.stringify(req)
    )
  },
  getContracts() {
    return api.GET<ApiResponse<GetContractRes>>('/api/v1/contract/')
  },
}
