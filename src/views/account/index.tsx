import React from 'react'
import { useRouter } from 'next/router'

import { Profile } from './components/profile'
import { FollowTab } from './components/follow-tab'
import { AccountTab } from './components/account-tab'
import { cn } from '@/lib/utils'
import { useUserInfo } from '@/hooks/use-user-info'
import { AccountProvider } from '@/contexts/account'

export const AccountPage = () => {
  const { query } = useRouter()
  const tokenAddr = (query.address || '') as string
  const {
    userInfo,
    otherUserInfo,
    isFetchingOtherUserInfo,
    isFetchingUserInfo,
    refetchUserInfo,
    refetchOtherUserInfo,
  } = useUserInfo(tokenAddr)
  const currenUserAddr = String(userInfo?.wallet_address || '')
  const isOtherUser = tokenAddr !== currenUserAddr

  return (
    <AccountProvider
      value={{
        userInfo: isOtherUser ? otherUserInfo : userInfo,
        isPending: isFetchingUserInfo || isFetchingOtherUserInfo,
        isOtherUser: isOtherUser,
        refetchUserInfo: isOtherUser ? refetchOtherUserInfo : refetchUserInfo,
      }}
    >
      <main className="min-h-main px-6 max-sm:px-3 flex gap-4 max-sm:flex-col max-sm:gap-2">
        {/* Left aside */}
        <aside
          className={cn(
            'h-fit flex flex-col gap-4 sticky top-20 mt-4',
            'max-sm:static max-sm:gap-2'
          )}
        >
          <Profile />
          <FollowTab />
        </aside>

        {/* Right tabs */}
        <AccountTab />
      </main>
    </AccountProvider>
  )
}

export default AccountPage
