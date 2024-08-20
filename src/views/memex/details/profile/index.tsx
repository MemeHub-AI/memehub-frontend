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
        <div className="min-h-main max-2xl:px-3 flex gap-4 max-2xl:flex-col max-2xl:gap-0">
          {/* Left aside */}
          <aside
            className={cn(
              'flex flex-col gap-4 max-2xl:gap-0 sticky top-20 mt-4 max-2xl:mb-2',
              'max-2xl:static max-2xl:gap-2'
            )}
          >
            <Profile />
            <div className="max-2xl:hidden max-2xl:mt-4">
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
