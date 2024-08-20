import { useEffect, useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { nanoid } from 'nanoid'

import { tokenApi } from '@/api/token'
import { useTokenQuery } from '@/views/token/hooks/use-token-query'
import { useCommentsStore } from '@/stores/use-comments'

export const useComments = (enableFetchComments = true) => {
  const { chainName, tokenAddr } = useTokenQuery()
  const uniqueId = useMemo(nanoid, [])
  const { setRefetchComments } = useCommentsStore()

  const {
    data: { total = 0, comments = [] } = {},
    isLoading,
    refetch: refetchComments,
    fetchNextPage,
  } = useInfiniteQuery({
    enabled: enableFetchComments && !!chainName && !!tokenAddr,
    queryKey: [tokenApi.getComments.name + uniqueId, chainName, tokenAddr],
    refetchOnWindowFocus: false,
    initialPageParam: 1,
    queryFn: ({ pageParam }) => {
      return tokenApi.getComments({
        chain: chainName,
        address: tokenAddr,
        page: pageParam,
        page_size: 25,
        reverse_time: true,
        flatten: true,
      })
    },
    getNextPageParam: (_, __, page) => page + 1,
    select: ({ pages }) => ({
      total: pages[0].data.count,
      comments: pages.flatMap((p) => p.data.results || []).filter(Boolean),
    }),
  })

  useEffect(() => {
    setRefetchComments(refetchComments)
  }, [refetchComments])

  return {
    total,
    comments,
    isLoading,
    refetchComments,
    fetchNextPage,
  }
}
