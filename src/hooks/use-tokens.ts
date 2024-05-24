import { useInfiniteQuery } from '@tanstack/react-query'

import { tokenApi } from '@/api/token'

export const useTokens = () => {
  const { data, isLoading, isFetching, fetchNextPage } = useInfiniteQuery({
    queryKey: [tokenApi.list.name],
    queryFn: ({ pageParam }) => {
      return tokenApi.list({
        page: pageParam,
        size: 25,
      })
    },
    initialPageParam: 1,
    getNextPageParam: (_, __, page) => page + 1,
  })
  const tokens = data?.pages.map((p) => p.data.results) || []

  return {
    totalToken: data?.pages[0].data.count || 0,
    tokens: tokens.filter(Boolean).flat(),
    isLoading,
    isFetching,
    fetchNextPage,
  }
}
