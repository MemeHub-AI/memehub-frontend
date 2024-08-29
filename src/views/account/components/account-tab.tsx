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

export const AccountTab = () => {
  const { t } = useTranslation()
  const { isOtherUser } = useAccountContext()
  const [isShowBorder, setIsShowBorder] = useState(true)
  const { query, ...router } = useRouter()

  const tab = String(query.tab || UserListType.CoinsCreated)
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
          'h-12 mb-2 max-sm:w-full max-sm:h-10 max-sm:mb-0',
          'border-none rounded-none text-base select-none'
        )}
      >
        {tabs.map((t) => (
          <TabsTrigger
            className={cn(
              'h-full w-full max-sm:px-2 max-sm:text-xs',
              ' data-[state=active]:text-black data-[state=active]:bg-white',
              'data-[state=active]:hover:bg-white hover:bg-white relative',
              'after:absolute hover:after:w-full after:h-[2px] after:bg-purple-500 after:bottom-0 after:left-0 after:hover:animate-left-to-right',
              isShowBorder &&
                'data-[state=active]:after:absolute data-[state=active]:after:animate-left-to-right data-[state=active]:after:w-full'
            )}
            key={t.value}
            value={t.value.toString()}
            onMouseEnter={() => setIsShowBorder(false)}
            onMouseLeave={() => setIsShowBorder(true)}
          >
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Token created */}
      <TabsContent value={UserListType.CoinsCreated.toString()}>
        <TokenCards
          className="md:grid-cols-2 xl:grid-cols-3"
          cards={myTokens}
          total={myTokenTotal}
          isLoading={isLoadingMyTokens}
          isPending={isFetchingMyTokens}
          onFetchNext={fetchNextMyTokens}
          showSearch={false}
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
