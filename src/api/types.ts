export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export enum ApiCode {
  Success = 200,
}

export interface PaginationReq {
  page?: number
  page_size?: number
}

export interface PaginationRes<T> {
  count: number
  results?: T[]
}
