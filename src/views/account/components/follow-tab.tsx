import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FollowersCards } from './followers-cards'
import { FollowingCards } from './following-cards'
import { useResponsive } from '@/hooks/use-responsive'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useUserList } from '../hooks/use-user-list'
import { UserListType } from '@/api/user/types'
import { FollowTabProvider } from '@/contexts/follow-tab'

export const FollowTab = () => {
  const { t } = useTranslation()
  const [tab, setTab] = useState(UserListType.Following)
  const { isMobile } = useResponsive()
  const {
    followers,
    isLoading: isLoadingFollowers,
    isFetching: isFetchingFollowers,
    refetch: refetchFollowers,
  } = useUserList(UserListType.Followers)
  const {
    following,
    isLoading: isLoadingFollowing,
    isFetching: isFetchingFollowing,
    refetch: refetchFollowing,
  } = useUserList(UserListType.Following)

  const renderTabs = () => {
    if (isMobile) {
      const isFollowers = tab === UserListType.Followers
      return (
        <Dialog>
          <div className="flex items-center justify-between"
            style={{ margin: "0 10px 10px 10px" }}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTab(UserListType.Followers)}
              >
                {t('followers')}({followers.total})
              </Button>
            </DialogTrigger>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTab(UserListType.Following)}
              >
                {t('following')}({following.total})
              </Button>
            </DialogTrigger>
          </div>

          <DialogContent className="p-4">
            <DialogHeader>
              <DialogTitle>
                {isFollowers ? t('followers.my') : t('following.my')}
              </DialogTitle>
            </DialogHeader>
            {isFollowers ? (
              <FollowersCards
                cards={followers.list}
                total={following.total}
                isLoading={isLoadingFollowers}
                isPending={isFetchingFollowers}
              />
            ) : (
              <FollowingCards
                cards={following.list}
                total={followers.total}
                isLoading={isLoadingFollowing}
                isPending={isFetchingFollowing}
              />
            )}
          </DialogContent>
        </Dialog>
      )
    }

    return (
      <Tabs value={tab.toString()} onValueChange={(t) => setTab(Number(t))}>
        <TabsList className="w-full">
          <TabsTrigger
            value={UserListType.Following.toString()}
            className="w-full"
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

  return (
    <FollowTabProvider
      value={{
        tab,
        refetchFollows:
          tab === UserListType.Followers ? refetchFollowers : refetchFollowing,
      }}
    >
      {/* adapt mobile */}
      {renderTabs()}
    </FollowTabProvider>
  )
}

export default FollowTab
