import React from 'react'
import { useTranslation } from 'react-i18next'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TokenHeldCards } from './token-held-cards'
import { MentionCards } from './mention-cards'
import { CommentCards } from '@/components/comment-cards'
import { TokenCards } from '@/components/token-cards'

enum Tab {
  TokensHeld = 'tokensHeld',
  TokensCreated = 'tokensCreated',
  Comments = 'comments',
  Mentions = 'mentions',
}

export const AccountTab = () => {
  const { t } = useTranslation()
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

  return (
    <Tabs defaultValue={Tab.TokensHeld} className="w-full mt-4 max-sm:mt-0">
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
        <TokenCards className="md:grid-cols-2 xl:grid-cols-3" />
      </TabsContent>
      <TabsContent value={Tab.Comments}>
        <CommentCards readonly />
      </TabsContent>
      <TabsContent value={Tab.Mentions}>
        <MentionCards />
      </TabsContent>
    </Tabs>
  )
}

export default AccountTab
