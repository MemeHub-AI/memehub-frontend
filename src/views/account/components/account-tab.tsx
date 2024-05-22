import React from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TokenHeldCards } from './token-held-cards'
import { MentionCards } from './mention-cards'
import { CommentCards } from '@/components/comment-cards'
import { TokenCards } from '@/components/token-cards'
import { useAccountContext } from '@/contexts/account'

enum Tab {
  TokensHeld = 'held',
  TokensCreated = 'created',
  Comments = 'comments',
  Mentions = 'mentions',
}

export const AccountTab = () => {
  const { t } = useTranslation()
  const { query, ...router } = useRouter()
  const tabs = [
    {
      label: t('token.held'),
      value: Tab.TokensHeld,
    },
    {
      label: t('token.created'),
      value: Tab.TokensCreated,
    },
    {
      label: t('comments'),
      value: Tab.Comments,
    },
    {
      label: t('mentions'),
      value: Tab.Mentions,
    },
  ]
  const { userInfo, isPending } = useAccountContext()

  return (
    <Tabs
      className="w-full mt-4 max-sm:mt-0"
      value={(query.tab as string) || Tab.TokensHeld}
      onValueChange={(value) => {
        router.push({
          pathname: router.pathname,
          query: { id: query.id, tab: value },
        })
      }}
    >
      <TabsList className="h-12 mb-2 max-sm:w-full max-sm:h-10 max-sm:mb-0">
        {tabs.map((t) => (
          <TabsTrigger
            className="h-full w-full max-sm:px-2 max-sm:text-xs"
            key={t.value}
            value={t.value}
          >
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value={Tab.TokensHeld}>
        <TokenHeldCards />
      </TabsContent>
      <TabsContent value={Tab.TokensCreated}>
        <TokenCards
          className="md:grid-cols-2 xl:grid-cols-3"
          cards={userInfo?.coins_created ?? []}
          isPending={isPending}
        />
      </TabsContent>
      <TabsContent value={Tab.Comments}>
        <CommentCards
          readonly
          cards={userInfo?.replies || []}
          isPending={isPending}
        />
      </TabsContent>
      <TabsContent value={Tab.Mentions}>
        <MentionCards
          cards={userInfo?.notifications || []}
          isPending={isPending}
        />
      </TabsContent>
    </Tabs>
  )
}

export default AccountTab
