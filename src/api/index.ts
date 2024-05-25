import { useFetch } from '@/hooks/use-fetch'

export interface ApiResponse<T> {
  code: number
  message: string
  data?: T
}

export enum ApiCode {
  Success = 200,
}

export const api = useFetch(process.env.NEXT_PUBLIC_API_URL!)
