import { useInfiniteQuery } from '@tanstack/react-query'

import { memexApi } from '@/api/memex'
import { MemexListType } from '@/api/memex/types'

export const useIdeaList = (type: MemexListType) => {
  const {
    data: { total = 0, list = [] } = {},
    isError,
    isLoading,
    isFetching,
    refetch,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: [memexApi.getIdeaList.name, type],
    queryFn: ({ pageParam }) =>
      memexApi.getIdeaList({
        page: pageParam,
        type,
      }),
    initialPageParam: 1,
    getNextPageParam: (_, __, page) => page + 1,
    select: ({ pages }) => ({
      total: pages[0].data.count,
      list: pages.flatMap((p) => p.data.results),
    }),
    refetchInterval: 5_000,
  })

  return {
    list,
    total,
    isError,
    isLoading,
    isFetching,
    refetch,
    fetchNextPage,
  }
}
