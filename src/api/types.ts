import { ObjectLike } from '@/utils/types'

export interface ApiResponse<T = null> {
  code: number
  message: string
  data: T
}

export enum ApiCode {
  Success = 200,
  AuthError = 401,
  NotFound = 404,
}

export interface PaginationReq {
  page?: number
  page_size?: number
}

export interface PaginationRes<T> {
  count: number
  results?: T[]
}

export interface Locale {
  zh?: string
  en?: string
}

export interface SearchReq {
  search?: string
}

export interface WsReceived<
  T extends ObjectLike<any>,
  E extends ObjectLike<any> = ObjectLike<any>
> {
  type: keyof T
  data: T[keyof T]
  error?: string
  extra?: E
}
