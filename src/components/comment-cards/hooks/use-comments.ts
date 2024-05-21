import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'

import type { TokenAddCommentReq } from '@/api/token/types'

import { tokenApi } from '@/api/token'

export const useComments = () => {
  const { t } = useTranslation()
  const { query } = useRouter()

  const {
    data: commentData,
    isFetching,
    refetch: refetchComments,
  } = useQuery({
    queryKey: [tokenApi.commentList.name, query.id],
    queryFn: () => tokenApi.commentList(query.id as string),
  })
  // Update a single comment, not the refresh list. so we need this state.
  const [comments, setComments] = useState(commentData?.data ?? [])

  const updateComment = (data: (typeof comments)[number]) => {
    setComments((old) => old.map((c) => (c.id === data.id ? data : c)))
  }

  // Add a new comment.
  const { mutateAsync: addComment } = useMutation({
    mutationKey: [tokenApi.addComment.name],
    mutationFn: (req: Omit<TokenAddCommentReq, 'coin'>) => {
      return tokenApi.addComment({ coin: query.id as string, ...req })
    },
    onMutate: () => toast.loading(t('comment.loading')),
    onError: () => toast.error(t('comment.failed')),
    onSuccess: ({ data }) => {
      toast.success(t('comment.success'))
      setComments((old) => [data, ...old])
    },
    onSettled: (_, __, ___, id) => toast.dismiss(id),
  })

  // Liked a comment.
  const { mutateAsync: likeComment } = useMutation({
    mutationKey: [tokenApi.like.name],
    mutationFn: tokenApi.like,
    onMutate: () => toast.loading(t('comment.like.loading')),
    onError: () => toast.error(t('comment.like.failed')),
    onSuccess: ({ data }) => {
      toast.success(t('comment.like.success'))
      updateComment(data)
    },
    onSettled: (_, __, ___, id) => toast.dismiss(id),
  })

  // Unliked a comment.
  const { mutateAsync: unlikeComment } = useMutation({
    mutationKey: [tokenApi.unlike.name],
    mutationFn: tokenApi.unlike,
    onMutate: () => toast.loading(t('comment.unlike.loading')),
    onError: () => toast.error(t('comment.unlike.failed')),
    onSuccess: ({ data }) => {
      toast.success(t('comment.unlike.success'))
      updateComment(data)
    },
    onSettled: (_, __, ___, id) => toast.dismiss(id),
  })

  // Listen comment list.
  useEffect(() => {
    if (!commentData || isEmpty(commentData?.data)) return

    // Sort by `created_at` DESC.
    setComments(
      commentData.data.sort((a, b) => {
        const tsA = dayjs(a.created_at).unix()
        const tsB = dayjs(b.created_at).unix()
        return tsB - tsA
      })
    )
  }, [commentData])

  return {
    comments,
    isFetching,
    addComment,
    likeComment,
    unlikeComment,
    refetchComments,
  }
}
