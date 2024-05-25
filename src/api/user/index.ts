import { qs } from '@/hooks/use-fetch'
import { api } from '..'

import type { ApiResponse, Pagination } from '../types'
import type {
  UserLoginReq,
  UserLoginRes,
  UserInfoRes,
  UserUpdateReq,
  UserListReq,
  UserListRes,
  UserListType,
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
    return api.GET<ApiResponse<UserInfoRes>>('/api/v1/user/users/')
  },
  list<T extends UserListType>(id: string, req: UserListReq) {
    return api.GET<ApiResponse<Pagination<UserListRes[T]>>>(
      `/api/v1/user/infolist/${id}/${qs.stringify(req)}`
    )
  },
  updateInfo(req: UserUpdateReq) {
    return api.PATCH<ApiResponse<UserInfoRes>>('/api/v1/user/users/', {
      body: req,
    })
  },
  follow(id: string) {
    return api.POST<ApiResponse<UserInfoRes>>(
      `/api/v1/user/users/${id}/followers/`
    )
  },
  unfollow(id: string) {
    return api.DELETE<ApiResponse<UserInfoRes>>(
      `/api/v1/user/users/${id}/followers/`
    )
  },
}
