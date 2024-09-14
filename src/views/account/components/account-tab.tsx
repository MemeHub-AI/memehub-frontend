import React, { useState } from 'react'
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
import { cn } from '@/lib/utils'
import { joinPaths } from '@/utils'
import MyIdeaPage from '@/views/memex/my-idea'
import AirdropPage from '@/views/airdrop'
import AccountLatestCard from './account-latest-card'

export const AccountTab = () => {
  const { t } = useTranslation()
  const { isOtherUser } = useAccountContext()
  const [isShowBorder, setIsShowBorder] = useState(true)
  const { query, ...router } = useRouter()

  const tab = String(query.tab || UserListType.Latest)
  // const myAccountTabs = [
  //   {
  //     label: t('comments'),
  //     value: UserListType.Comments,
  //   },
  //   {
  //     label: t('mentions'),
  //     value: UserListType.Mentions,
  //   },
  // ]
  // const tabs = [
  //   {
  //     label: t('token.created'),
  //     value: UserListType.CoinsCreated,
  //   },
  //   {
  //     label: t('token.held'),
  //     value: UserListType.CoinsHeld,
  //   },
  //   ...(isOtherUser ? [] : myAccountTabs),
  // ]
  const tabs = [
    {
      label: t('latest'),
      value: UserListType.Latest,
    },
    {
      label: `🚀 ${t('Idea')}`,
      value: UserListType.Idea,
    },
    // ...(userInfo ? userTabs : []),
    {
      label: t('airdrop'),
      value: UserListType.Airdrops,
    },
    {
      label: `✊ ${t('call')}`,
      value: UserListType.Mentions,
    },
  ]

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
  } = useUserList(Number(tab), isOtherUser)

  return (
    <Tabs
      className="w-full mt-4 max-sm:mt-0 max-lg:px-3"
      value={tab}
      onValueChange={(value) => {
        if (!query.address) return
        router.push(
          {
            pathname: joinPaths(Routes.Account, query.address as string),
            query: { tab: value },
          },
          undefined,
          { shallow: true }
        )
      }}
    >
      <TabsList
        className={cn(
          'h-12 mb-2 max-sm:w-full max-sm:h-10 max-sm:mb-0 flex items-center justify-start',
          'border-none rounded-none text-base select-none space-x-1 md:space-x-2'
        )}
      >
        {tabs.map((t) => (
          <TabsTrigger
            className={cn(
              'max-sm:text-xs border border-zinc-700 rounded-full w-20 h-7',
              'data-[state=active]:bg-blue-600',
              'data-[state=active]:hover:bg-blue-600 hover:bg-gray-200'
            )}
            key={t.value}
            value={t.value.toString()}
          >
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Token created */}
      <TabsContent value={UserListType.Latest.toString()}>
        {/* <TokenCards
          className="md:grid-cols-2 xl:grid-cols-3"
          cards={myTokens}
          total={myTokenTotal}
          isLoading={isLoadingMyTokens}
          isPending={isFetchingMyTokens}
          onFetchNext={fetchNextMyTokens}
          showSearch={false}
        /> */}
        <AccountLatestCard />
      </TabsContent>

      {/* Token held */}
      <TabsContent value={UserListType.Idea.toString()}>
        {/* <TokenHeldCards
          cards={tokenHeld.list}
          total={tokenHeld.total}
          isLoading={isLoading}
          isPending={isFetching}
          onFetchNext={fetchNextPage}
        /> */}
        <MyIdeaPage />
      </TabsContent>

      {/* Only self can see. */}
      {!isOtherUser && (
        <>
          <TabsContent value={UserListType.Airdrops.toString()}>
            {/* <CommentCards
              disableToProfile
              readonly
              cards={comments.list}
              total={comments.total}
              isLoading={isLoading}
              isPending={isFetching}
              onFetchNext={fetchNextPage}
            /> */}
            <AirdropPage />
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
