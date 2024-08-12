import { useInfiniteQuery } from '@tanstack/react-query'

import { memexApi } from '@/api/memex'

export const useInvolvedList = () => {
  const {
    data: { total = 0, list = [] } = {},
    isError,
    isLoading,
    isFetching,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: [memexApi.getMyJoin.name],
    queryFn: ({ pageParam }) => memexApi.getMyJoin({ page: pageParam }),
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
