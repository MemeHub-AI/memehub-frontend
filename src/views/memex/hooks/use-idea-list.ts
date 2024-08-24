import { useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'

import { memexApi } from '@/api/memex'
import { MemexListType } from '@/api/memex/types'
import { ApiCode } from '@/api/types'

export const useIdeaList = (type: MemexListType) => {
  const getIdeaList = useMemo(() => {
    const isUserList = type === MemexListType.My || type === MemexListType.Join
    return isUserList ? memexApi.getUserIdeaList : memexApi.getIdeaList
  }, [type])

  const {
    data: { total = 0, list = [] } = {},
    isError,
    isLoading,
    isFetching,
    refetch,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: [getIdeaList.name, type],
    queryFn: ({ pageParam }) =>
      getIdeaList({
        type,
        page: pageParam,
        page_size: pageParam == 1 ? 10 : 20,
      }),
    initialPageParam: 1,
    getNextPageParam: (_, __, page) => page + 1,
    select: ({ pages }) => ({
      total: pages[0].data.count,
      list: pages.flatMap((p) => p.data.results || []).filter(Boolean),
    }),
    refetchInterval: 5_000,
    retry: (count, error: Response) => {
      if (error.status === ApiCode.AuthError) return false
      return count < 3
    },
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
