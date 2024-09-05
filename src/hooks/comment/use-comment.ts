import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import type { TokenCommentListRes } from '@/api/token/types'
import { tokenApi } from '@/api/token'
import { useTypedFn } from '@/hooks/use-typed-fn'

interface Options {
  onCommentSuccess?: (data: TokenCommentListRes) => void
  onLikeSuccess?: (data: TokenCommentListRes) => void
  onUnlikeSuccess?: (data: TokenCommentListRes) => void
}

export const useComment = (options?: Options) => {
  const { onCommentSuccess, onLikeSuccess, onUnlikeSuccess } = options ?? {}
  const { t } = useTranslation()

  // Add a new comment.
  const { isPending: isCommenting, mutateAsync: addComment } = useMutation({
    mutationKey: [tokenApi.addComment.name],
    mutationFn: tokenApi.addComment,
    onMutate: () => toast.loading(t('comment.loading')),
    onError: () => toast.error(t('comment.failed')),
    onSuccess: ({ data }) => {
      toast.success(t('comment.success'))
      onCommentSuccess?.(data)
    },
    onSettled: (_, __, ___, id) => toast.dismiss(id),
  })

  const [toasts, setType] = useTypedFn({
    like: {
      loading: () => toast.loading(t('comment.like.loading')),
      error: () => toast.error(t('comment.like.failed')),
      success: () => toast.success(t('comment.like.success')),
    },
    unlike: {
      loading: () => toast.loading(t('comment.unlike.loading')),
      error: () => toast.error(t('comment.unlike.failed')),
      success: () => toast.success(t('comment.unlike.success')),
    },
  })

  // Liked a comment.
  const { isPending: isLiking, mutateAsync } = useMutation({
    mutationKey: [tokenApi.like.name],
    mutationFn: tokenApi.like,
    onMutate: toasts.loading,
    onError: toasts.error,
    onSuccess: ({ data }) => {
      toasts.success()
      onLikeSuccess?.(data)
      onUnlikeSuccess?.(data)
    },
    onSettled: (_, __, ___, id) => toast.dismiss(id),
  })

  const likeComment = (id: string) => {
    setType('like')
    mutateAsync({
      comment_id: +id,
      like: true,
    })
  }

  const unlikeComment = (id: string) => {
    setType('unlike')
    mutateAsync({
      comment_id: +id,
      like: false,
    })
  }

  return {
    isCommenting,
    isLiking,
    isUnliking: isLiking,
    addComment,
    likeComment,
    unlikeComment,
  }
}
