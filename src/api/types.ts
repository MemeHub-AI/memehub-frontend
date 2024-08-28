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
  TooLarge = 413,
  Conflict = 409,
}

export interface PaginationReq {
  page?: number
  page_size?: number
}

export interface PaginationRes<T> {
  count: number
  next: null | number
  previous: null | number
  results?: T[]
}

export interface Locale {
  zh?: string
  en?: string
}

export interface SearchReq {
  search?: string
}

interface WsReceivedBase<T extends string, D = unknown, E = unknown> {
  type: T
  data: D
  extra?: E
  error?: string
}

export type WsReceived<T extends ObjectLike<[any, any?]>> = {
  [K in keyof T & string]: WsReceivedBase<K, T[K][0], T[K][1]>
}
