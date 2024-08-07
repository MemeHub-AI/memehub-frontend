import React, { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CommentCards } from '@/components/comment-cards'
import { TradeTable } from './trade-table'
import { useComments } from '@/components/comment-cards/hooks/use-comments'
import { useStorage } from '@/hooks/use-storage'
import { useTokenContext } from '@/contexts/token'

enum Tab {
  Comments = 'comments',
  Trades = 'trades',
}

export const CommentTradeTab = ({ className }: ComponentProps<'div'>) => {
  const { t } = useTranslation()
  const { getCommentTradeTab, setCommentTradeTab } = useStorage()
  const { isNotFound } = useTokenContext()

  const {
    comments,
    total,
    isLoading,
    isFetching,
    fetchNextPage,
    addComment,
    updateComment,
  } = useComments()

  return (
    <Tabs
      defaultValue={getCommentTradeTab() || Tab.Comments}
      className={cn('mt-3', className)}
      onValueChange={(value) => setCommentTradeTab(value)}
    >
      <TabsList className="rounded-md">
        <TabsTrigger value={Tab.Comments} disabled={isNotFound}>
          {t('comments')}
        </TabsTrigger>
        <TabsTrigger value={Tab.Trades} disabled={isNotFound}>
          {t('trades')}
        </TabsTrigger>
      </TabsList>
      <TabsContent value={Tab.Comments} className="mt-2 max-sm:mt-1">
        <CommentCards
          cards={comments}
          total={total}
          isLoading={isLoading}
          isPending={isFetching}
          onFetchNext={fetchNextPage}
          onCommentSuccess={addComment}
          onLikeSuccess={updateComment}
          onUnlikeSuccess={updateComment}
        />
      </TabsContent>
      <TabsContent value={Tab.Trades} className="max-sm:mt-2">
        <TradeTable />
      </TabsContent>
    </Tabs>
  )
}
