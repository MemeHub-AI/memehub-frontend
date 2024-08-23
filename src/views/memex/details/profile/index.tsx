import PrimaryLayout from '@/components/layouts/primary'
import { cn } from '@/lib/utils'
import { useUserInfo } from '@/hooks/use-user-info'
import { AccountProvider } from '@/contexts/account'
import { useRouter } from 'next/router'
import Profile from '@/views/account/components/profile'
import FollowTab from '@/views/account/components/follow-tab'
import AccountTab from '@/views/account/components/account-tab'
import { useUserList } from '@/views/account/hooks/use-user-list'
import { UserListType } from '@/api/user/types'
import MemexProfile from '../components/memex-profile'

export const MemexDetailsProfile = () => {
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
      <PrimaryLayout>
        <div className="flex-1 min-h-main flex gap-2 flex-col h-[calc(100vh-64px)] overflow-auto px-4">
          {/* Left aside */}
          <aside
            className={cn(
              'flex flex-col gap-4 sticky top-20 mt-4 mb-2',
              'static gap-2'
            )}
          >
            <MemexProfile />
            <div className="hidden mt-4">
              <FollowTab />
            </div>
          </aside>

          {/* Right tabs */}
          <AccountTab />
        </div>
      </PrimaryLayout>
    </AccountProvider>
  )
}

export default MemexDetailsProfile
