import { useEffect, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { isEmpty } from 'lodash'

import { tokenApi } from '@/api/token'
import { TokenCommentListRes } from '@/api/token/types'

export const useComments = (enableFetchComments = true) => {
  const { query } = useRouter()

  const {
    data: commentData,
    isLoading,
    isFetching,
    refetch: refetchComments,
    fetchNextPage,
  } = useInfiniteQuery({
    enabled: enableFetchComments,
    queryKey: [tokenApi.commentList.name, query.address],
    refetchOnWindowFocus: false,
    queryFn: ({ pageParam }) => {
      const tokenAddr = (query.address || '') as string

      if (isEmpty(tokenAddr)) return Promise.reject()

      // Claer when query.
      setComments([])
      return tokenApi.commentList(tokenAddr, {
        page: pageParam,
        page_size: 25,
      })
    },
    initialPageParam: 1,
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
