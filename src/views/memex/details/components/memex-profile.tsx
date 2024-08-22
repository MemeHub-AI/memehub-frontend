import DiamondIcon from '@/components/diamond-icon'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useAccountContext } from '@/contexts/account'
import FollowTab from '@/views/account/components/follow-tab'
import { EnvelopeClosedIcon, HeartFilledIcon } from '@radix-ui/react-icons'
import { useTranslation } from 'react-i18next'
import { IoMdMore } from 'react-icons/io'

const MemexProfile = () => {
  const { userInfo, isOtherUser, refetchUserInfo, refetchFollow } =
    useAccountContext()
  const { t } = useTranslation()

  return (
    <div className="h-52 flex-1 w-full rounded-lg border-2 border-zinc-200 overflow-hidden">
      <div
        className="bg-cover bg-center h-72"
        style={{ backgroundImage: `url(/images/memex-profile-bg.jpg)` }}
      />
      <div className="bg-white p-2">
        <div className="w-full flex justify-between items-start">
          <div className="flex space-x-4">
            <Avatar
              src={userInfo?.logo || ''}
              fallback={userInfo?.wallet_address.slice(-4)}
              size={128}
              className="border-4 border-amber-300/40 bg-gray-50 bottom-10"
            />
            <div>
              <p className="font-bold text-2xl">{userInfo?.name}</p>
              <FollowTab />
              {/* <span className="cursor-default">
                {t('account.total-likes')}:
              </span> */}
              <div className="flex space-x-4 items-center">
                <span className="inline-flex items-center text-red-500">
                  <HeartFilledIcon className="mr-1" />{' '}
                  {userInfo?.like_count || 0}
                </span>
                {/* <span>{t('account.total-mentions')}:</span> */}
                <span className="inline-flex items-center ml-1 text-black">
                  <EnvelopeClosedIcon className="mr-1" />
                  {userInfo?.mention_count || 0}
                </span>
                <span className="flex items-center space-x-2">
                  <DiamondIcon size={17} />
                  <span className="font-bold">
                    {userInfo?.reward_amount || 0}
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-6 items-center">
            <Button>
              <span className="text-sm">{t('edit')}</span>
            </Button>
            <IoMdMore size={25} className="cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MemexProfile
