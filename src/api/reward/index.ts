import { api } from '..'
import { qs } from '@/hooks/use-fetch'
import {
  InvitationCodeReq,
  InvCount,
  DiamondAddReq,
  DiamondAddRes,
} from './types'
import { ApiResponse } from '../types'

export const rewardApi = {
  async getInviteCode() {
    return api.GET<ApiResponse<string>>('/api/v1/user/invite/')
  },
  async modifyUser(req: InvitationCodeReq) {
    return api.POST<ApiResponse<string>>(
      '/api/v1/user/invite/' + qs.stringify(req)
    )
  },
  async getInvCount() {
    return api.GET<ApiResponse<InvCount>>('/api/v1/user/invite/count/')
  },
  async diamondAdd(req: DiamondAddReq) {
    return api.GET<ApiResponse<DiamondAddRes>>(
      '/api/v1/airdrop/get_reward_amount/' + qs.stringify(req)
    )
  },
}
