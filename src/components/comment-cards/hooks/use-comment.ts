import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import type { TokenAddCommentReq, TokenCommentListRes } from '@/api/token/types'

import { tokenApi } from '@/api/token'

interface Options {
  onCommentSuccess?: (data: TokenCommentListRes) => void
  onLikeSuccess?: (data: TokenCommentListRes) => void
  onUnlikeSuccess?: (data: TokenCommentListRes) => void
}

export const useComment = (options?: Options) => {
  const { onCommentSuccess, onLikeSuccess, onUnlikeSuccess } = options ?? {}
  const { query } = useRouter()
  const { t } = useTranslation()

  // Add a new comment.
  const { isPending: isCommenting, mutateAsync: addComment } = useMutation({
    mutationKey: [tokenApi.addComment.name],
    mutationFn: (req: Omit<TokenAddCommentReq, 'coin'>) => {
      return tokenApi.addComment({ coin: query.address as string, ...req })
    },
    onMutate: () => toast.loading(t('comment.loading')),
    onError: () => toast.error(t('comment.failed')),
    onSuccess: ({ data }) => {
      toast.success(t('comment.success'))
      onCommentSuccess?.(data)
    },
    onSettled: (_, __, ___, id) => toast.dismiss(id),
  })

  // Liked a comment.
  const { isPending: isLiking, mutateAsync: likeComment } = useMutation({
    mutationKey: [tokenApi.like.name],
    mutationFn: tokenApi.like,
    onMutate: () => toast.loading(t('comment.like.loading')),
    onError: () => toast.error(t('comment.like.failed')),
    onSuccess: ({ data }) => {
      toast.success(t('comment.like.success'))
      onLikeSuccess?.(data)
    },
    onSettled: (_, __, ___, id) => toast.dismiss(id),
  })

  // Unliked a comment.
  const { isPending: isUnliking, mutateAsync: unlikeComment } = useMutation({
    mutationKey: [tokenApi.unlike.name],
    mutationFn: tokenApi.unlike,
    onMutate: () => toast.loading(t('comment.unlike.loading')),
    onError: () => toast.error(t('comment.unlike.failed')),
    onSuccess: ({ data }) => {
      toast.success(t('comment.unlike.success'))
      onUnlikeSuccess?.(data)
    },
    onSettled: (_, __, ___, id) => toast.dismiss(id),
  })

  return {
    isCommenting,
    isLiking,
    isUnliking,
    addComment,
    likeComment,
    unlikeComment,
  }
}
