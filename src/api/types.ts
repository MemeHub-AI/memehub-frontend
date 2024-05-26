export interface Pagination<T> {
  count: number
  results?: T[]
}

export interface ApiResponse<T> {
  code: number
  message: string
  data?: T
}

export enum ApiCode {
  Success = 200,
}
