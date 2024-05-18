import { api, type ApiResponse } from '..'

import type { NewUserReq, NewUserRes } from './types'

export const userApi = {
  new(req: NewUserReq) {
    return api.POST<ApiResponse<NewUserRes>>('/api/v1/user/users/', {
      body: req,
    })
  },
}
