import React from 'react'
import { useRouter } from 'next/router'

import { Profile } from './components/profile'
import { FollowDesktop } from './components/follow-desktop'
import { AccountTab } from './components/account-tab'
import { cn } from '@/lib/utils'
import { useUserInfo } from '@/hooks/use-user-info'
import { AccountProvider } from '@/contexts/account'
import { useUserList } from './hooks/use-user-list'
import { UserListType } from '@/api/user/types'

export const AccountPage = () => {
  const { query } = useRouter()
  const queryAddr = (query.address || '') as string
  const {
    userInfo,
    otherUserInfo,
    isFetchingOtherUserInfo,
    isFetchingUserInfo,
    refetchUserInfo,
    refetchOtherUserInfo,
  } = useUserInfo(queryAddr)
  const currenUserAddr = String(userInfo?.wallet_address || '')
  const isOtherUser = queryAddr !== currenUserAddr

  const followersResults = useUserList(UserListType.Followers)
  const followingResults = useUserList(UserListType.Following)

  const refetchFollow = () => {
    followersResults.refetch()
    followingResults.refetch()
  }

  return (
    <AccountProvider
      value={{
        userInfo: isOtherUser ? otherUserInfo : userInfo,
        isPending: isFetchingUserInfo || isFetchingOtherUserInfo,
        isOtherUser: isOtherUser,
        refetchUserInfo: isOtherUser ? refetchOtherUserInfo : refetchUserInfo,
        followersResults,
        followingResults,
        refetchFollow,
      }}
    >
      <main className="min-h-main px-6 max-sm:px-3 flex gap-4 max-sm:flex-col max-sm:gap-0">
        {/* Left aside */}
        <aside
          className={cn(
            'h-fit flex flex-col gap-4 max-sm:gap-0 sticky top-20 mt-4 max-sm:mb-2',
            'max-sm:static max-sm:gap-2'
          )}
        >
          <Profile />
          <div className="max-sm:hidden max-sm:mt-4">
            <FollowDesktop />
          </div>
        </aside>

        {/* Right tabs */}
        <AccountTab />
      </main>
    </AccountProvider>
  )
}

export default AccountPage
