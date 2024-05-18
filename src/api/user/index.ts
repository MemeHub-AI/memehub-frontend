import { api, type ApiResponse } from '..'

import type { NewUserReq } from './types'

export const userApi = {
  new(req: NewUserReq) {
    return api.POST<ApiResponse<NewUserReq>>('/api/v1/user/users/', {
      body: req,
    })
  },
}
