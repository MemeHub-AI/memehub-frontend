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

export interface WsReceived<
  D = unknown,
  T extends string = string,
  E = unknown
> {
  type: T
  data: D
  error?: string
  extra?: E
}
