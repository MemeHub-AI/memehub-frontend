import { useInfiniteQuery } from '@tanstack/react-query'

import { memexApi } from '@/api/memex'
import { useCreateToken } from '@/views/create/hooks/use-create-token'
import { MemexListType } from '@/api/memex/types'

export const usePostList = (type: MemexListType) => {
  const { memexFactoryAddr } = useCreateToken()

  const {
    data: { total = 0, list = [] } = {},
    isError,
    isLoading,
    isFetching,
    refetch,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: [memexApi.getPostList.name, type, memexFactoryAddr],
    queryFn: ({ pageParam }) =>
      memexApi.getPostList({
        page: pageParam,
        type,
        factory_address: memexFactoryAddr!,
      }),
    initialPageParam: 1,
    getNextPageParam: (_, __, page) => page + 1,
    select: ({ pages }) => ({
      total: pages[0].data.count,
      list: pages.flatMap((p) => p.data.results),
    }),
    enabled: !!memexFactoryAddr,
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
