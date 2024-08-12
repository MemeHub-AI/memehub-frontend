import { useInfiniteQuery } from '@tanstack/react-query'

import { memexApi } from '@/api/memex'

export const useSuccessedList = () => {
  const {
    data: { total = 0, list = [] } = {},
    error,
    isError,
    isLoading,
    isFetching,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: [memexApi.getSuccessed.name],
    queryFn: ({ pageParam }) => memexApi.getSuccessed({ page: pageParam }),
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
    error,
    isError,
    isLoading,
    isFetching,
    fetchNextPage,
  }
}
