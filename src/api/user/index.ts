import { api } from '..'
import { qs } from '@/utils/qs'
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
  login: (req: UserLoginReq) => {
    return api.POST<ApiResponse<UserLoginRes>>('/api/v1/user/users/', {
      body: req,
    })
  },
  getOtherInfo: (addr: string) => {
    return api.GET<ApiResponse<UserInfoRes>>(`/api/v1/user/users/${addr}/`)
  },
  getInfo: () => {
    return api.GET<ApiResponse<UserInfoRes>>('/api/v1/user/users/')
  },
  list: <T extends UserListType>(addr: string, req: UserListReq) => {
    return api.GET<ApiResponse<PaginationRes<UserListRes[T]>>>(
      `/api/v1/user/infolist/${addr}/${qs.stringify(req)}`
    )
  },
  updateInfo: (req: UserUpdateReq) => {
    return api.PATCH<ApiResponse<UserInfoRes>>('/api/v1/user/users/', {
      body: req,
    })
  },
  follow: (addr: string) => {
    return api.POST<ApiResponse<UserInfoRes>>(
      `/api/v1/user/users/${addr}/followers/`
    )
  },
  unfollow: (id: string) => {
    return api.DELETE<ApiResponse<UserInfoRes>>(
      `/api/v1/user/users/${id}/followers/`
    )
  },
}
