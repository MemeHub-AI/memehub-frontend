import React, { ReactNode, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { AlertDialog, AlertDialogCancel } from '@/components/ui/alert-dialog'
import { CommentForm } from '@/components/comment-cards/components/form'
import { useComment } from '@/components/comment-cards/hooks/use-comment'
import { useCommentsStore } from '@/stores/use-comments'

interface Props {
  children: ReactNode
  onTrade?: () => void
}

export const TradeCommentDialog = ({ children, onTrade }: Props) => {
  const { t } = useTranslation()
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const { addComment } = useComment()
  const { refetchComments } = useCommentsStore()

  const handleTrade = () => {
    closeRef.current?.click()
    onTrade?.()
  }

  return (
    <AlertDialog
      showFooter={false}
      content={
        <>
          <CommentForm
            autoFocus
            showCancel
            showEmptyTips={false}
            buttonText={t('trade')}
            buttonClass="bg-lime-green"
            onCommentClick={handleTrade}
            onComment={(content, _, img) => {
              addComment({
                content,
                related_comments: [],
                img,
              }).finally(refetchComments)
            }}
            onCancel={() => closeRef.current?.click()}
          />
          <AlertDialogCancel ref={closeRef} className="hidden" />
        </>
      }
    >
      {children}
    </AlertDialog>
  )
}

export default TradeCommentDialog
