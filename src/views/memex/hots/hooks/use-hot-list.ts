import { useInfiniteQuery } from '@tanstack/react-query'

import { memexApi } from '@/api/memex'

export const useHotList = () => {
  const {
    data: { total = 0, list = [] } = {},
    isError,
    isLoading,
    isFetching,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: [memexApi.getHots.name],
    queryFn: ({ pageParam }) => memexApi.getHots({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (_, __, page) => page + 1,
    select: ({ pages }) => ({
      total: pages[0].data.count,
      list: pages.flatMap((p) => p.data.results),
    }),
  })

  return {
    list,
    total,
    isError,
    isLoading,
    isFetching,
    fetchNextPage,
  }
}
