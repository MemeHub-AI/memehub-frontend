import React, { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CommentCards } from '@/components/comment-cards'
import { TradeTable } from './trade-table'
import { useComments } from '@/components/comment-cards/hooks/use-comments'
import { useLocalStorage } from '@/hooks/use-storage'
import { useTokenContext } from '@/contexts/token'

enum Tab {
  Comments = 'comments',
  Trades = 'trades',
}

export const CommentTradeTab = ({ className }: ComponentProps<'div'>) => {
  const { t } = useTranslation()
  const { getStorage, setStorage } = useLocalStorage()
  const { isNotFound } = useTokenContext()

  const { comments, total, isLoading, fetchNextPage, refetchComments } =
    useComments()

  return (
    <Tabs
      defaultValue={getStorage('comment_trade_tab') || Tab.Comments}
      className={cn('mt-3', className)}
      onValueChange={(value) => setStorage('comment_trade_tab', value)}
    >
      <TabsList className="rounded-md select-none">
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
          isPending={isLoading}
          onFetchNext={fetchNextPage}
          onCommentSuccess={refetchComments}
          onLikeSuccess={refetchComments}
          onUnlikeSuccess={refetchComments}
        />
      </TabsContent>
      <TabsContent value={Tab.Trades} className="max-sm:mt-2 overflow-auto">
        <TradeTable />
      </TabsContent>
    </Tabs>
  )
}
