import { api } from '..'
import { qs } from '@/hooks/use-fetch'

import { RewardItem } from './types'
import { ApiResponse, PaginationReq, PaginationRes } from '../types'

export const inviteApi = {
  getRewardList(req: PaginationReq) {
    return api.GET<ApiResponse<PaginationRes<RewardItem>>>(
      '/api/v1/user/invite/list/' + qs.stringify(req)
    )
  },
  bindInviter(req: { invitationCode: string }) {
    return api.POST<ApiResponse>('/api/v1/user/invite/', { body: req })
  },
}
