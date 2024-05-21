import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import type { TokenAddCommentReq } from '@/api/token/types'

import { tokenApi } from '@/api/token'

export const useComments = () => {
  const { t } = useTranslation()
  const { query } = useRouter()

  const {
    data: comments,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [tokenApi.commentList.name, query.id],
    queryFn: async () => {
      try {
        const res = await tokenApi.commentList(query.id as string)
        return res.data.sort((a, b) => {
          const tsA = dayjs(a.created_at).unix()
          const tsB = dayjs(b.created_at).unix()
          return tsB - tsA
        })
      } catch (error) {
        console.error('commentList error:', error)
        return []
      }
    },
  })

  const { mutateAsync: addComment } = useMutation({
    mutationKey: [tokenApi.addComment.name],
    mutationFn: (req: Omit<TokenAddCommentReq, 'coin'>) => {
      return tokenApi.addComment({ coin: query.id as string, ...req })
    },
    onMutate: () => toast.loading(t('comment.loading')),
    onError: () => toast.error(t('comment.failed')),
    onSuccess: () => toast.success(t('comment.success')),
    onSettled: (_, __, ___, id) => {
      toast.dismiss(id)
      refetch()
    },
  })

  const { mutateAsync: likeComment } = useMutation({
    mutationKey: [tokenApi.like.name],
    mutationFn: tokenApi.like,
    onMutate: () => toast.loading(t('comment.like.loading')),
    onError: () => toast.error(t('comment.like.failed')),
    onSuccess: () => toast.success(t('comment.like.success')),
    onSettled: (_, __, ___, id) => {
      toast.dismiss(id)
      refetch()
    },
  })

  const { mutateAsync: unlikeComment } = useMutation({
    mutationKey: [tokenApi.unlike.name],
    mutationFn: tokenApi.unlike,
    onMutate: () => toast.loading(t('comment.unlike.loading')),
    onError: () => toast.error(t('comment.unlike.failed')),
    onSuccess: () => toast.success(t('comment.unlike.success')),
    onSettled: (_, __, ___, id) => {
      toast.dismiss(id)
      refetch()
    },
  })

  return {
    comments: comments ?? [],
    isFetching,
    addComment,
    likeComment,
    unlikeComment,
  }
}
