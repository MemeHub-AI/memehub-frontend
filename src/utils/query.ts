import { PaginationRes } from '@/api/types'

export const paginationSelect = <T>(data: PaginationRes<T>) => ({
  total: data.count || 0,
  list: data.results || [],
})
