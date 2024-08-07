import { useEffect, useMemo, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { isEmpty } from 'lodash'
import { nanoid } from 'nanoid'
import { isAddress } from 'viem'

import { tokenApi } from '@/api/token'
import { TokenCommentListRes } from '@/api/token/types'
import { useTradeSearchParams } from '@/views/token/hooks/use-search-params'
import { useCommentsStore } from '@/stores/use-comments'

export const useComments = (enableFetchComments = true) => {
  const { chainName, tokenAddr } = useTradeSearchParams()
  const uniqueId = useMemo(nanoid, [])
  const { setRefetchComments } = useCommentsStore()

  const {
    data: commentData,
    isLoading,
    isFetching,
    refetch: refetchComments,
    fetchNextPage,
  } = useInfiniteQuery({
    enabled: enableFetchComments,
    queryKey: [tokenApi.commentList.name + uniqueId, chainName, tokenAddr],
    refetchOnWindowFocus: false,
    initialPageParam: 1,
    queryFn: ({ pageParam }) => {
      return Promise.reject()

      // Claer when query.
      setComments([])
      return tokenApi.commentList(chainName, tokenAddr, {
        page: pageParam,
        page_size: 25,
      })
    },
    getNextPageParam: (_, __, page) => page + 1,
  })
  // Update a single comment, not the refresh list. so we need this state.
  const [comments, setComments] = useState<TokenCommentListRes[]>([])

  const addComment = (data: (typeof comments)[number]) => {
    setComments((old) => [data, ...old])
  }

  const updateComment = (data: (typeof comments)[number]) => {
    setComments((old) => old.map((c) => (c.id === data.id ? data : c)))
  }

  useEffect(() => {
    setRefetchComments(refetchComments)
  }, [refetchComments])

  // Listen comment list.
  useEffect(() => {
    const commentList =
      commentData?.pages
        .map((p) => p.data?.results)
        .filter(Boolean)
        .flat() || []

    if (!commentData || isEmpty(commentList)) return

    setComments(commentList as TokenCommentListRes[])
  }, [commentData])

  return {
    total: commentData?.pages[0].data?.count || 0,
    comments,
    isLoading,
    isFetching,
    refetchComments,
    fetchNextPage,
    addComment,
    updateComment,
  }
}
