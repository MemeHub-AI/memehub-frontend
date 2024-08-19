import React from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TokenHeldCards } from './token-held-cards'
import { MentionCards } from './mention-cards'
import { CommentCards } from '@/components/comment-cards'
import { TokenCards } from '@/components/token-cards'
import { useUserList } from '../hooks/use-user-list'
import { UserListType } from '@/api/user/types'
import { Routes } from '@/routes'
import { useAccountContext } from '@/contexts/account'

export const AccountTab = () => {
  const { t } = useTranslation()
  const { query, ...router } = useRouter()
  const { isOtherUser } = useAccountContext()
  const myAccountTabs = [
    {
      label: t('comments'),
      value: UserListType.Comments,
    },
    {
      label: t('mentions'),
      value: UserListType.Notifications,
    },
  ]
  const tabs = [
    {
      label: t('token.held'),
      value: UserListType.CoinsHeld,
    },
    {
      label: t('token.created'),
      value: UserListType.CoinsCreated,
    },
    ...(isOtherUser ? [] : myAccountTabs),
  ]
  const tab = String(query.tab || UserListType.CoinsCreated)
  const {
    tokenHeld,
    comments,
    mentions,
    isLoading,
    isFetching,
    fetchNextPage,

    myTokens,
    myTokenTotal,
    isLoadingMyTokens,
    isFetchingMyTokens,
    fetchNextMyTokens,
  } = useUserList(Number(tab))

  console.log('token held', tokenHeld)

  return (
    <Tabs
      className="w-full mt-4 max-sm:mt-0"
      value={tab}
      onValueChange={(value) => {
        router.push({
          pathname: `${Routes.Account}/${query.address}`,
          query: { tab: value },
        })
      }}
    >
      <TabsList className="h-12 mb-2 max-sm:w-full max-sm:h-10 max-sm:mb-0">
        {tabs.map((t) => (
          <TabsTrigger
            className="h-full w-full max-sm:px-2 max-sm:text-xs"
            key={t.value}
            value={t.value.toString()}
          >
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Token held */}
      <TabsContent value={UserListType.CoinsHeld.toString()}>
        <TokenHeldCards
          cards={tokenHeld.list}
          total={tokenHeld.total}
          isLoading={isLoading}
          isPending={isFetching}
          onFetchNext={fetchNextPage}
        />
      </TabsContent>

      {/* Token created */}
      <TabsContent value={UserListType.CoinsCreated.toString()}>
        <TokenCards
          className="md:grid-cols-2 xl:grid-cols-3"
          cards={myTokens}
          total={myTokenTotal}
          isLoading={isLoadingMyTokens}
          isPending={isFetchingMyTokens}
          onFetchNext={fetchNextMyTokens}
        />
      </TabsContent>

      {/* Only self can see. */}
      {!isOtherUser && (
        <>
          <TabsContent value={UserListType.Comments.toString()}>
            <CommentCards
              readonly
              cards={comments.list}
              total={comments.total}
              isLoading={isLoading}
              isPending={isFetching}
              onFetchNext={fetchNextPage}
            />
          </TabsContent>
          <TabsContent value={UserListType.Notifications.toString()}>
            <MentionCards
              cards={mentions.list}
              total={mentions.total}
              isLoading={isLoading}
              isPending={isFetching}
              onFetchNext={fetchNextPage}
            />
          </TabsContent>
        </>
      )}
    </Tabs>
  )
}

export default AccountTab
