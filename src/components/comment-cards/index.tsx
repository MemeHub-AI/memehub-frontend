import React, { type ComponentProps, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import type { UserListRes, UserListType } from '@/api/user/types'
import { CommentCard } from './components/card'
import { CommentForm } from './components/form'
import { Dialog } from '@/components/ui/dialog'
import { CustomSuspense } from '../custom-suspense'
import { Skeleton } from '../ui/skeleton'
import { useComment } from './hooks/use-comment'
import { useScrollLoad } from '@/hooks/use-scroll-load'
import { useTokenInfo } from '@/views/token/hooks/use-token-info'
import { useTokenQuery } from '@/views/token/hooks/use-token-query'

interface Props extends ComponentProps<'div'> {
  cards: UserListRes[UserListType.Comments][]
  total: number
  isLoading: boolean
  isPending?: boolean
  readonly?: boolean
  disableToProfile?: boolean
  onFetchNext?: () => void
  onCommentSuccess?: () => void
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
    disableToProfile,
    onFetchNext,
    onCommentSuccess,
    onLikeSuccess,
    onUnlikeSuccess,
  } = props
  const { t } = useTranslation()
  const [replyId, setReplyId] = useState<number | null>(null)
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
  const { chainName, tokenAddr } = useTokenQuery()
  const { isNotFound } = useTokenInfo(tokenAddr, chainName)

  const onComment = (content: string, mentions: string[], img?: string) => {
    addComment({
      chain: chainName,
      address: tokenAddr,
      content,
      related_comment: replyId,
      images: img ? [img] : [],
    }).then(() => setReplyId(null)) // Close when success.
  }

  useEffect(() => {
    if (lastAnchor === -1) return

    window.setTimeout(() => setLastAnchor(-1), 1_000)
  }, [lastAnchor])

  return (
    <>
      {/* Reply dialog. */}
      <Dialog
        open={replyId !== null}
        // Close the dialog if `false`.
        onOpenChange={(value) => !value && setReplyId(null)}
      >
        <CommentForm
          autoFocus
          isCommenting={isCommenting}
          onComment={onComment}
        />
      </Dialog>

      {!readonly && <CommentForm className="mb-4" onComment={onComment} />}
      {!isNotFound && (
        <>
          <CustomSuspense
            className="flex flex-col w-[30rem] max-sm:w-full"
            isPending={isLoading}
            fallback={<CardSkeleton />}
            nullback={
              <p className="text-zinc-500">{t('comment.list.empty')}</p>
            }
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
                  disableToProfile={disableToProfile}
                  onLike={likeComment}
                  onUnlike={unlikeComment}
                  onReply={(id) => setReplyId(+id)}
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
            {noMore && (
              <p className="text-zinc-500 text-center">{t('nomore')}</p>
            )}
          </CustomSuspense>
        </>
      )}
    </>
  )
}

const CardSkeleton = () => {
  return Array.from({ length: 3 }).map((_, i) => (
    <div className="border-b-2 flex flex-col p-4 relative" key={i}>
      <div className="flex items-stretch">
        <Skeleton className="rounded-full w-8 h-8" />
        <div className="flex flex-col justify-between ml-2">
          <Skeleton className="w-16 h-4" />
          <Skeleton className="w-20 h-3" />
        </div>
      </div>
      <Skeleton className="h-4 w-1/2 mt-3" />
      <div className="flex mt-2 absolute right-0 top-0">
        <Skeleton className="h-5 w-8" />
        <Skeleton className="h-5 w-8 ml-2" />
      </div>
    </div>
  ))
}

export default CommentCards
