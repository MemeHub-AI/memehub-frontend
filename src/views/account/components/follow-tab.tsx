import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FollowersCards } from './followers-cards'
import { FollowingCards } from './following-cards'
import { useResponsive } from '@/hooks/use-responsive'
import { UserListType } from '@/api/user/types'
import { useIsMemex } from '@/hooks/use-is-memex'
import { useAccountContext } from '@/contexts/account'
import { FollowDialog } from './follow-dialog'

export const FollowTab = () => {
  const { t } = useTranslation()
  const [tab, setTab] = useState(UserListType.Following)
  const { isMobile } = useResponsive()
  const { isMemex } = useIsMemex()
  const { followersResults, followingResults, refetchFollow } =
    useAccountContext()
  const {
    followers,
    isLoading: isLoadingFollowers,
    isFetching: isFetchingFollowers,
  } = followersResults
  const {
    following,
    isLoading: isLoadingFollowing,
    isFetching: isFetchingFollowing,
  } = followingResults

  if (isMobile || isMemex) return <FollowDialog tab={tab} setTab={setTab} />

  return (
    <Tabs
      value={tab.toString()}
      onValueChange={(t) => {
        setTab(Number(t))
        refetchFollow()
      }}
    >
      <TabsList className="w-full">
        <TabsTrigger
          value={UserListType.Following.toString()}
          className="w-full"
          asChild
        >
          {t('following')}({following.total})
        </TabsTrigger>
        <TabsTrigger
          value={UserListType.Followers.toString()}
          className="w-full"
        >
          {t('followers')}({followers.total})
        </TabsTrigger>
      </TabsList>

      <TabsContent value={UserListType.Followers.toString()}>
        <FollowersCards
          cards={followers.list}
          total={followers.total}
          isLoading={isLoadingFollowers}
          isPending={isFetchingFollowers}
        />
      </TabsContent>
      <TabsContent value={UserListType.Following.toString()}>
        <FollowingCards
          cards={following.list}
          total={following.total}
          isLoading={isLoadingFollowing}
          isPending={isFetchingFollowing}
        />
      </TabsContent>
    </Tabs>
  )
}

export default FollowTab
