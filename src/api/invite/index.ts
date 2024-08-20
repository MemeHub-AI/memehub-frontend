import { api } from '..'
import { qs } from '@/hooks/use-fetch'

import { RewardDetailRes, RewardItem } from './types'
import { ApiResponse, PaginationReq, PaginationRes } from '../types'

export const inviteApi = {
  getRewardList: (req: PaginationReq) => {
    return api.GET<ApiResponse<PaginationRes<RewardItem>>>(
      '/api/v1/user/invite/list/' + qs.stringify(req)
    )
  },
  getDetail: (code: string) => {
    return api.GET<ApiResponse<RewardDetailRes>>(`/api/v1/user/invite/${code}/`)
  },
  getIsBound: (req: { invitationCode: string }) => {
    return api.POST<ApiResponse<boolean>>('/api/v1/user/invite/relation/', {
      body: req,
    })
  },
}
