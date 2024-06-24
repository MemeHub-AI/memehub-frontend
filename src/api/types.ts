export interface ApiResponse<T = null> {
  code: number
  message: string
  data: T
}

export enum ApiCode {
  Success = 200,
  AuthError = 400,
}

export interface PaginationReq {
  page?: number
  page_size?: number
}

export interface PaginationRes<T> {
  count: number
  results?: T[]
}
