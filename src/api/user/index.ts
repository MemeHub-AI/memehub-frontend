import { api, type ApiResponse } from '..'

import type {
  UserLoginReq,
  UserLoginRes,
  UserInfoRes,
  UserMyInfoRes,
  UserUpdateReq,
} from './types'

export const userApi = {
  login(req: UserLoginReq) {
    return api.POST<ApiResponse<UserLoginRes>>('/api/v1/user/users/', {
      body: req,
    })
  },
  getInfo(id: string) {
    return api.GET<ApiResponse<UserInfoRes>>(`/api/v1/user/users/${id}/`)
  },
  getInfoFromToken() {
    return api.GET<ApiResponse<UserMyInfoRes>>('/api/v1/user/users/')
  },
  updateInfo(req: UserUpdateReq) {
    return api.PATCH<ApiResponse<UserMyInfoRes>>('/api/v1/user/users/', {
      body: req,
    })
  },
  follow(id: string) {
    return api.POST<ApiResponse<UserMyInfoRes>>(
      `/api/v1/user/users/${id}/followers/`
    )
  },
  unfollow(id: string) {
    return api.DELETE<ApiResponse<UserMyInfoRes>>(
      `/api/v1/user/users/${id}/followers/`
    )
  },
}
