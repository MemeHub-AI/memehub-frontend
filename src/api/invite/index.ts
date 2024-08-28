import { api } from '..'
import { qs } from '@/utils/qs'
import type { RewardDetailRes, RewardItem } from './types'
import type { ApiResponse, PaginationReq, PaginationRes } from '../types'

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
