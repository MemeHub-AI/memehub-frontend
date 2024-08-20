import PrimaryLayout from '@/components/layouts/primary'
import { cn } from '@/lib/utils'
import { useUserInfo } from '@/hooks/use-user-info'
import { AccountProvider } from '@/contexts/account'
import { useRouter } from 'next/router'
import Profile from '@/views/account/components/profile'
import FollowTab from '@/views/account/components/follow-tab'
import AccountTab from '@/views/account/components/account-tab'

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

  return (
    <AccountProvider
      value={{
        userInfo: isOtherUser ? otherUserInfo : userInfo,
        isPending: isFetchingUserInfo || isFetchingOtherUserInfo,
        isOtherUser: isOtherUser,
        refetchUserInfo: isOtherUser ? refetchOtherUserInfo : refetchUserInfo,
      }}
    >
      <PrimaryLayout>
        <div className="flex-1 min-h-main px-6 max-sm:px-3 flex gap-4 max-sm:flex-col max-sm:gap-0">
          {/* Left aside */}
          <aside
            className={cn(
              'h-fit flex flex-col gap-4 max-sm:gap-0 sticky top-20 mt-4 max-sm:mb-2',
              'max-sm:static max-sm:gap-2'
            )}
          >
            <Profile />
            <div className="max-sm:hidden max-sm:mt-4">
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
