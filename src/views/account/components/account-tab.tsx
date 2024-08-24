import React, { useMemo } from 'react'
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
import { useIsMemex } from '@/hooks/use-is-memex'
import { cn } from '@/lib/utils'

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
      value: UserListType.Mentions,
    },
  ]
  const tabs = [
    {
      label: t('token.created'),
      value: UserListType.CoinsCreated,
    },
    {
      label: t('token.held'),
      value: UserListType.CoinsHeld,
    },
    ...(isOtherUser ? [] : myAccountTabs),
  ]
  const tab = String(query.tab || UserListType.CoinsCreated)
  const {
    tokenCreated,
    tokenHeld,
    comments,
    mentions,
    isLoading,
    isFetching,
    fetchNextPage,

    // myTokens,
    // myTokenTotal,
    // isLoadingMyTokens,
    // isFetchingMyTokens,
    // fetchNextMyTokens,
  } = useUserList(Number(tab))
  const { isMemex } = useIsMemex()

  const createdList = useMemo(
    () =>
      isOtherUser
        ? tokenCreated.list.filter((t) => t.is_active)
        : tokenCreated.list,
    [tokenCreated.list]
  )

  // console.log('other created', isOtherUser, tokenCreated.list)

  return (
    <Tabs
      className="w-full mt-4 max-sm:mt-0"
      value={tab}
      onValueChange={(value) => {
        router.push({
          pathname: `${isMemex ? Routes.MemexDetailsProfile : Routes.Account}/${
            query.address
          }`,
          query: { tab: value },
        })
      }}
    >
      <TabsList
        className={cn(
          'h-12 mb-2 max-sm:w-full max-sm:h-10 max-sm:mb-0',
          isMemex && 'bg-white'
        )}
      >
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

      {/* Token created */}
      <TabsContent value={UserListType.CoinsCreated.toString()}>
        <TokenCards
          className="md:grid-cols-2 xl:grid-cols-3"
          cards={createdList}
          total={tokenCreated.total}
          isLoading={isLoading}
          isPending={isFetching}
          onFetchNext={fetchNextPage}
        />
      </TabsContent>

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

      {/* Only self can see. */}
      {!isOtherUser && (
        <>
          <TabsContent value={UserListType.Comments.toString()}>
            <CommentCards
              disableToProfile
              readonly
              cards={comments.list}
              total={comments.total}
              isLoading={isLoading}
              isPending={isFetching}
              onFetchNext={fetchNextPage}
            />
          </TabsContent>
          <TabsContent value={UserListType.Mentions.toString()}>
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
