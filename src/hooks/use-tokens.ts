import { useInfiniteQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'

import { tokenApi } from '@/api/token'

enum Default {
  Page = 1,
  PageSize = 10,
}

export const useTokens = () => {
  const { query, ...router } = useRouter()

  const { data } = useInfiniteQuery({
    initialPageParam: Number(query.page) || Default.Page,
    queryKey: [tokenApi.list.name, router.isReady],
    queryFn: ({ pageParam }) => {
      if (!router.isReady) return Promise.reject()

      return tokenApi.list({
        page: pageParam.toString(),
        page_size: String(query.page_size || Default.PageSize),
      })
    },
    getNextPageParam: (_, __, page) => page + 1,
  })

  return {
    totalToken: data?.pages[0].count || '0',
    tokens: data?.pages.map((p) => p.results).flat() || [],
  }
}
