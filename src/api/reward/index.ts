import { api } from '..'
import { ApiResponse } from '../types'
import { RewardInfoRes } from './types'

export const rewardApi = {
  getRewardInfo: () => {
    return api.GET<ApiResponse<RewardInfoRes>>('/api/v1/reward-info')
  },
}
