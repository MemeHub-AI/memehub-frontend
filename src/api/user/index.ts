import { qs } from '@/hooks/use-fetch'
import { api } from '..'

import type { ApiResponse, PaginationRes } from '../types'
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
  getInfo(addr: string) {
    return api.GET<ApiResponse<UserInfoRes>>(`/api/v1/user/users/${addr}/`)
  },
  getInfoFromToken() {
    return api.GET<ApiResponse<UserInfoRes>>('/api/v1/user/users/')
  },
  list<T extends UserListType>(addr: string, req: UserListReq) {
    return api.GET<ApiResponse<PaginationRes<UserListRes[T]>>>(
      `/api/v1/user/infolist/${addr}/${qs.stringify(req)}`
    )
  },
  updateInfo(req: UserUpdateReq) {
    return api.PATCH<ApiResponse<UserInfoRes>>('/api/v1/user/users/', {
      body: req,
    })
  },
  follow(addr: string) {
    return api.POST<ApiResponse<UserInfoRes>>(
      `/api/v1/user/users/${addr}/followers/`
    )
  },
  unfollow(addr: string) {
    return api.DELETE<ApiResponse<UserInfoRes>>(
      `/api/v1/user/users/${addr}/followers/`
    )
  },
}
