import React, { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CommentCards } from '@/components/comment-cards'
import { TradeTable } from './trade-table'
import { useComments } from '@/components/comment-cards/hooks/use-comments'

enum Tab {
  Comments = 'comments',
  Trades = 'trades',
}

export const CommentTradeTab = (props: ComponentProps<'div'>) => {
  const { className } = props
  const { t } = useTranslation()
  const { comments, isFetching } = useComments()

  return (
    <Tabs defaultValue={Tab.Comments} className={cn('mt-4', className)}>
      <TabsList>
        <TabsTrigger value={Tab.Comments}>{t('comments')}</TabsTrigger>
        <TabsTrigger value={Tab.Trades}>{t('trades')}</TabsTrigger>
      </TabsList>
      <TabsContent value={Tab.Comments} className="mt-4 max-sm:mt-2">
        <CommentCards cards={comments} isPending={isFetching} />
      </TabsContent>
      <TabsContent value={Tab.Trades} className="max-sm:mt-1">
        <TradeTable />
      </TabsContent>
    </Tabs>
  )
}
