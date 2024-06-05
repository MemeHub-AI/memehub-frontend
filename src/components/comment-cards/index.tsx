import React, { type ComponentProps, useState, useEffect } from 'react'
import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'

import type { UserListRes, UserListType } from '@/api/user/types'
import type { TokenCommentListRes } from '@/api/token/types'

import { CommentCard } from './components/card'
import { CommentForm } from './components/form'
import { Dialog } from '@/components/ui/dialog'
import { CustomSuspense } from '../custom-suspense'
import { Skeleton } from '../ui/skeleton'
import { useComment } from './hooks/use-comment'
import { useScrollLoad } from '@/hooks/use-scroll-load'

interface Props extends ComponentProps<'div'> {
  cards: UserListRes[UserListType.Replies][]
  total: number
  isLoading: boolean
  isPending?: boolean
  readonly?: boolean
  onFetchNext?: () => void
  onCommentSuccess?: (data: TokenCommentListRes) => void
  onLikeSuccess?: (data: TokenCommentListRes) => void
  onUnlikeSuccess?: (data: TokenCommentListRes) => void
}

export const CommentCards = (props: Props) => {
  const {
    cards,
    total,
    isLoading,
    isPending = false,
    readonly = false,
    onFetchNext,
    onCommentSuccess,
    onLikeSuccess,
    onUnlikeSuccess,
  } = props
  const { t } = useTranslation()
  const [replyId, setReplyId] = useState('')
  const [lastAnchor, setLastAnchor] = useState(-1)
  const {
    isCommenting,
    isLiking,
    isUnliking,
    addComment,
    likeComment,
    unlikeComment,
  } = useComment({
    onCommentSuccess,
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
        <CommentForm isCommenting={isCommenting} onComment={onComment} />
      </Dialog>

      {!readonly && <CommentForm className="mb-4" onComment={onComment} />}
      <CustomSuspense
        className="flex flex-col w-[30rem]"
        isPending={isLoading}
        fallback={<CardSkeleton />}
        nullback={<p className="text-zinc-500">{t('comment.list.empty')}</p>}
      >
        {cards.map((c, i) => (
          <React.Fragment key={c.id}>
            <CommentCard
              key={c.id}
              c={c}
              readonly={readonly}
              isActive={c.id === lastAnchor}
              isLiking={isLiking}
              isUnliking={isUnliking}
              onLike={likeComment}
              onUnlike={unlikeComment}
              onReply={(id) => setReplyId(id)}
              onAnchorClick={setLastAnchor}
            />
            {i !== cards.length - 1 && (
              <hr className="border-t-2 border-black" />
            )}
          </React.Fragment>
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
  return Array.from({ length: 3 }).map((_, i) => (
    <div className="border-b-2 flex flex-col p-4 relative" key={i}>
      <div className="flex gap-2 items-stretch">
        <Skeleton className="rounded-full w-8 h-8" />
        <div className="flex flex-col justify-between">
          <Skeleton className="w-16 h-4" />
          <Skeleton className="w-20 h-3" />
        </div>
      </div>
      <Skeleton className="h-4 w-1/2 mt-3" />
      <div className="flex gap-2 mt-2 absolute right-0 top-0">
        <Skeleton className="h-5 w-8" />
        <Skeleton className="h-5 w-8" />
      </div>
    </div>
  ))
}

export default CommentCards
