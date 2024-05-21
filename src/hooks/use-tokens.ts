import { useInfiniteQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'

import { tokenApi } from '@/api/token'

enum Default {
  Page = 1,
  PageSize = 12,
}

export const useTokens = () => {
  const { query, ...router } = useRouter()

  const { data, isFetching } = useInfiniteQuery({
    initialPageParam: Number(query.page) || Default.Page,
    queryKey: [tokenApi.list.name, router.isReady],
    queryFn: ({ pageParam }) => {
      if (!router.isReady) return Promise.reject()

      return tokenApi.list({
        page: pageParam.toString(),
        size: String(query.size || Default.PageSize),
      })
    },
    getNextPageParam: (_, __, page) => page + 1,
  })
  const flatTokens = data?.pages.map((p) => p.data.results).flat() || []

  return {
    totalToken: data?.pages[0].data.count || '0',
    tokens: flatTokens.filter(Boolean),
    isFetching,
  }
}
