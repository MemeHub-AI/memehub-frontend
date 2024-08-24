import DiamondIcon from '@/components/diamond-icon'
import { Button } from '@/components/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { Popover } from '@/components/ui/popover'
import { useAccountContext } from '@/contexts/account'
import { useClipboard } from '@/hooks/use-clipboard'
import { useUser } from '@/hooks/use-user'
import { Routes } from '@/routes'
import FollowTab from '@/views/account/components/follow-tab'
import ProfileForm from '@/views/account/components/profile-form'
import {
  EnvelopeClosedIcon,
  HeartFilledIcon,
  MinusIcon,
  PlusIcon,
} from '@radix-ui/react-icons'
import { PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { IoMdMore } from 'react-icons/io'
import { IoCopyOutline, IoSettingsOutline } from 'react-icons/io5'
import MemexAvatar from './memex-avatar'
import { cn } from '@/lib/utils'

export const MemexProfile = () => {
  const { userInfo, isOtherUser, refetchUserInfo, refetchFollow } =
    useAccountContext()
  const { isFollowing, isUnfollowing, follow, unfollow, update } = useUser({
    onFollowFinlly: () => {
      refetchUserInfo()
      refetchFollow()
    },
  })
  const { t } = useTranslation()
  const { copy } = useClipboard()
  const { query, ...router } = useRouter()
  const tokenAddr = (query.address || '') as string

  const HoverCardPop: React.FC<{
    children: React.ReactNode
    content: string
    variant?: 'start' | 'center' | 'end'
    position?: 'top' | 'bottom' | 'left' | 'right'
    className?: string
  }> = ({
    children,
    content,
    variant = 'center',
    position = 'bottom',
    className,
  }) => (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent
        className={cn(
          'p-1 w-32 border-none text-center font-medium text-base',
          className
        )}
        align={variant}
        side={position}
      >
        {content}
      </HoverCardContent>
    </HoverCard>
  )

  // let rewardAmount = userInfo?.reward_amount
  // console.log('11111111111111', typeof rewardAmount, rewardAmount)

  return (
    <div className="flex-1 w-full rounded-lg border-2 border-zinc-200 overflow-hidden">
      <div
        className="bg-cover bg-center h-72"
        style={{ backgroundImage: `url(/images/memex-profile-bg.jpg)` }}
      />
      <div className="bg-white px-2 pt-2 relative after:absolute after:w-full after:h-px after:bg-zinc-200 after:bottom-5 after:left-0">
        <div className="w-full flex justify-between items-start">
          <div className="flex space-x-4">
            <MemexAvatar
              userInfo={userInfo}
              isOtherUser={isOtherUser}
              update={update}
              refetchUserInfo={refetchUserInfo}
            />

            <div>
              <p className="font-bold text-2xl">{userInfo?.name}</p>
              <FollowTab />

              <div className="flex space-x-4 items-center">
                <HoverCardPop content={t('account.total-likes')}>
                  <span className="inline-flex items-center text-red-500">
                    <HeartFilledIcon className="mr-1" />{' '}
                    {userInfo?.like_count || 0}
                  </span>
                </HoverCardPop>

                <HoverCardPop content={t('account.total-mentions')}>
                  <span className="inline-flex items-center ml-1 text-black">
                    <EnvelopeClosedIcon className="mr-1" />
                    {userInfo?.mention_count || 0}
                  </span>
                </HoverCardPop>

                <HoverCardPop
                  content={t('reward.desc3')}
                  variant="start"
                  className="w-40"
                >
                  <span
                    onClick={() => {
                      if (isOtherUser) return
                      router.push(Routes.Reward)
                    }}
                    className={cn(
                      'flex items-center space-x-2',
                      !isOtherUser &&
                        'hover:underline-offset-1 hover:underline outline-black cursor-pointer'
                    )}
                  >
                    <DiamondIcon size={17} />
                    <span className="font-bold">
                      {Number(userInfo?.reward_amount).toFixed(4) || 0}
                    </span>
                  </span>
                </HoverCardPop>
              </div>
            </div>
          </div>
          <div className="flex space-x-6 items-center">
            {isOtherUser ? (
              <Button
                variant={'purple'}
                shadow={'none'}
                className="flex items-center space-x-2"
                disabled={isFollowing || isUnfollowing}
                onClick={() =>
                  userInfo?.is_follower
                    ? unfollow(tokenAddr)
                    : follow(tokenAddr)
                }
              >
                {userInfo?.is_follower ? <MinusIcon /> : <PlusIcon />}
                <span className="text-sm">
                  {userInfo?.is_follower ? t('unfollow') : t('follow')}
                </span>
              </Button>
            ) : (
              <ProfileForm>
                <Button
                  variant={'purple'}
                  shadow={'none'}
                  className="flex items-center space-x-2"
                >
                  <IoSettingsOutline size={18} />
                  <span className="text-sm">{t('edit')}</span>
                </Button>
              </ProfileForm>
            )}

            <Popover>
              <PopoverTrigger>
                <IoMdMore size={25} className="cursor-pointer" />
              </PopoverTrigger>
              <PopoverContent
                side="left"
                sideOffset={10}
                align="start"
                className="flex items-center gap-2 mt-10 w-52 rounded-md shadow-md shadow-zinc-300 bg-gray-50 text-black p-2 cursor-pointer hover:bg-zinc-100 text-sm border border-zinc-400"
                onClick={() => copy(userInfo?.wallet_address ?? '')}
              >
                <IoCopyOutline size={17} />
                <p>{t('copy.wallet.address')}</p>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      <div className="align-top p-2 relative bottom-[0.65rem]">
        <p className="text-zinc-600">
          {t('bio')}:{' '}
          {userInfo?.description ? userInfo?.description : t('there.noting')}
        </p>
      </div>
    </div>
  )
}

export default MemexProfile
