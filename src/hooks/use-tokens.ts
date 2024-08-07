import { useInfiniteQuery } from '@tanstack/react-query'

import { tokenApi } from '@/api/token'
import { TokenListItem } from '@/api/token/types'

export const useTokens = () => {
  const {
    data: { tokens = [], totalToken = 0 } = {},
    isLoading,
    isFetching,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: [tokenApi.getList.name],
    queryFn: ({ pageParam }) => {
      return tokenApi.getList({
        page: pageParam,
        page_size: 25,
      })
    },
    initialPageParam: 1,
    getNextPageParam: (_, __, page) => page + 1,
    select: (data) => ({
      totalToken: data.pages[0].data.count,
      tokens: data.pages
        .flatMap((p) => p.data.results)
        .filter(Boolean) as TokenListItem[],
    }),
  })

  return {
    totalToken,
    tokens,
    isLoading,
    isFetching,
    fetchNextPage,
  }
}
