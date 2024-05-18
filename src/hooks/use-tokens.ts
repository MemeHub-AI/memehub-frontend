import { useInfiniteQuery } from '@tanstack/react-query'

import { tokenApi } from '@/api/token'

export const useTokens = () => {
  const { data } = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: [tokenApi.list.name],
    queryFn: ({ pageParam }) => {
      return tokenApi.list({
        page: pageParam.toString(),
        page_size: String(10),
      })
    },
    getNextPageParam: (_, __, page) => page + 1,
  })

  return {
    totalToken: data?.pages[0].count || '0',
    tokens: data?.pages.map((p) => p.results).flat() || [],
  }
}
