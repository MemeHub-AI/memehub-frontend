import React, { type ReactNode, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { AlertDialog, AlertDialogCancel } from '@/components/ui/alert-dialog'
import { CommentForm } from '@/components/comment-cards/components/form'
import { useComment } from '@/components/comment-cards/hooks/use-comment'
import { useCommentsStore } from '@/stores/use-comments'
import { useTokenQuery } from '../hooks/use-token-query'

interface Props {
  open?: boolean
  onOpenChange?: (value: boolean) => void
  children?: ReactNode
  onTrade?: () => void
}

export const TradeCommentDialog = ({
  children,
  open,
  onOpenChange,
  onTrade,
}: Props) => {
  const { t } = useTranslation()
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const { addComment } = useComment()
  const { refetchComments } = useCommentsStore()
  const { chainName, tokenAddr } = useTokenQuery()

  const handleTrade = () => {
    closeRef.current?.click()
    onTrade?.()
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
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
                chain: chainName,
                address: tokenAddr,
                content,
                related_comment: null,
                images: img ? [img] : [],
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
