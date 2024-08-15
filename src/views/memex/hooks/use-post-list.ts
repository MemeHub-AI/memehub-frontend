import { useInfiniteQuery } from '@tanstack/react-query'

import { memexApi } from '@/api/memex'
import { MemexListType } from '@/api/memex/types'
import { useTokenConfig } from '@/hooks/use-token-config'

export const usePostList = (type: MemexListType) => {
  const { memexFactoryAddr } = useTokenConfig()

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
