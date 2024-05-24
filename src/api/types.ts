export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export enum ApiCode {
  Success = 200,
}

export interface PaginationParams {
  page: number
  size: number
}

export interface Pagination<T> {
  count: number
  results?: T[]
}
