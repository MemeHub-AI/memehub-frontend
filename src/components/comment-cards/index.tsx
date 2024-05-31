import React, { type ComponentProps, useState, useEffect } from 'react'
import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'

import { CommentCard } from './components/card'
import { CommentForm } from './components/form'
import { Dialog } from '@/components/ui/dialog'
import { CustomSuspense } from '../custom-suspense'
import { Skeleton } from '../ui/skeleton'
import { useComment } from './hooks/use-comment'
import { useScrollLoad } from '@/hooks/use-scroll-load'
import { UserListRes, UserListType } from '@/api/user/types'

interface Props extends ComponentProps<'div'> {
  cards: UserListRes[UserListType.Replies][]
  total: number
  isLoading: boolean
  isPending?: boolean
  readonly?: boolean
  onFetchNext?: () => void
  onAddSuccess?: () => void
  onLikeSuccess?: () => void
  onUnlikeSuccess?: () => void
}

export const CommentCards = (props: Props) => {
  const {
    cards,
    total,
    isLoading,
    isPending = false,
    readonly = false,
    onFetchNext,
    onAddSuccess,
    onLikeSuccess,
    onUnlikeSuccess,
  } = props
  const { t } = useTranslation()
  const [replyId, setReplyId] = useState('')
  const [lastAnchor, setLastAnchor] = useState(-1)
  const { addComment, likeComment, unlikeComment } = useComment({
    onAddSuccess,
    onLikeSuccess,
    onUnlikeSuccess,
  })
  const { noMore } = useScrollLoad({
    onFetchNext,
    hasMore: cards.length < total,
  })

  const onComment = (content: string, mentions: string[], img?: string) => {
    const related_comments = [...mentions]

    // Reply another comment.
    if (replyId) related_comments.push(replyId)
    addComment({ content, related_comments, img }).then(() => setReplyId('')) // Close when success.
  }

  useEffect(() => {
    if (lastAnchor === -1) return

    window.setTimeout(() => setLastAnchor(-1), 1_000)
  }, [lastAnchor])

  return (
    <>
      {/* Reply dialog. */}
      <Dialog
        open={!isEmpty(replyId)}
        // Close the dialog if `false`.
        onOpenChange={(value) => !value && setReplyId('')}
      >
        <CommentForm onComment={onComment} />
      </Dialog>

      {!readonly && <CommentForm className="mb-4" onComment={onComment} />}
      <CustomSuspense
        className="flex flex-col gap-2"
        isPending={isLoading}
        fallback={<CardSkeleton />}
        nullback={<p className="text-zinc-500">{t('comment.list.empty')}</p>}
      >
        {cards.map((c) => (
          <CommentCard
            key={c.id}
            c={c}
            readonly={readonly}
            isActive={c.id === lastAnchor}
            onLike={likeComment}
            onUnlike={unlikeComment}
            onReply={(id) => setReplyId(id)}
            onAnchorClick={setLastAnchor}
          />
        ))}
        {isPending && (
          <p className="text-zinc-500 text-center">{t('loading')}</p>
        )}
        {noMore && <p className="text-zinc-500 text-center">{t('nomore')}</p>}
      </CustomSuspense>
    </>
  )
}

const CardSkeleton = () => {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div className="border shadow rounded-md flex flex-col p-4" key={i}>
          <div className="flex gap-2 items-stretch">
            <Skeleton className="rounded-full w-8 h-8" />
            <div className="flex flex-col justify-between">
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-20 h-3" />
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <div className="flex gap-2 mt-2">
            <Skeleton className="h-5 w-8" />
            <Skeleton className="h-5 w-14" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default CommentCards
