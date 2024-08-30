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
      return tokenApi.getList([
        ['page', pageParam.toString()],
        ['page_size', '25'],
        ['orderby', 'type'],
        ['orderby', '-marketcap'],
        ['orderby', '-time'],
      ])
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

  const {
    data: { idoTokens = [], idoTotal = 0 } = {},
    isLoading: isLoadingIdo,
    fetchNextPage: fetchNextpageIdo,
  } = useInfiniteQuery({
    queryKey: [tokenApi.getIdoList.name],
    queryFn: () => tokenApi.getIdoList(),
    initialPageParam: 1,
    getNextPageParam: (_, __, page) => page + 1,
    select: (data) => ({
      idoTotal: data.pages[0].data.count,
      idoTokens: data.pages
        .flatMap((p) => p.data.results)
        .filter(Boolean) as TokenListItem[],
    }),
  })

  return {
    totalToken,
    tokens,
    idoTokens,
    idoTotal,
    isLoading,
    isFetching,
    isLoadingIdo,
    fetchNextPage,
    fetchNextpageIdo,
  }
}
