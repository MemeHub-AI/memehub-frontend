import {
  EnvelopeClosedIcon,
  HeartFilledIcon,
  MinusIcon,
  PlusIcon,
} from '@radix-ui/react-icons'
import MemexAvatar from '../../memex/components/memex-avatar'
import { AccountInfoProps, HoverCardPop } from './profile'
import FollowMoblie from '@/views/account/components/follow-mobile'
import DiamondIcon from '@/components/diamond-icon'
import { Routes } from '@/routes'
import router from 'next/router'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import ProfileForm from '@/views/account/components/profile-form'
import { IoCopyOutline, IoSettingsOutline } from 'react-icons/io5'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { IoMdMore } from 'react-icons/io'
import { useClipboard } from '@/hooks/use-clipboard'
import { fmt } from '@/utils/fmt'
import { useResponsive } from '@/hooks/use-responsive'

export const AccountInfoMoblie = (props: AccountInfoProps) => {
  const {
    userInfo,
    isOtherUser,
    isFollowing,
    isUnfollowing,
    tokenAddr,
    update,
    follow,
    unfollow,
    refetchUserInfo,
  } = props
  const { t } = useTranslation()
  const { copy } = useClipboard()

  return (
    <div className="relative flex justify-around">
      <div className="absolute -top-[19rem] flex -right-1 space-x-2">
        {isOtherUser ? (
          <Button
            variant={'purple'}
            shadow={'none'}
            className="flex items-center space-x-2"
            disabled={isFollowing || isUnfollowing}
            onClick={() =>
              userInfo?.is_follower ? unfollow(tokenAddr) : follow(tokenAddr)
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
          <PopoverTrigger className="backdrop-blur-sm bg-white/30 rounded-lg p-y px-2">
            <IoMdMore size={25} className="cursor-pointer" color="#ffffff" />
          </PopoverTrigger>
          <PopoverContent
            side="left"
            align="start"
            sideOffset={-42}
            className={cn(
              'flex items-center gap-2 mt-10 w-52 rounded-md p-2',
              'hover:bg-zinc-100 text-sm border border-zinc-400 cursor-pointer',
              'backdrop-blur-sm bg-white/30 text-white'
            )}
            onClick={() => copy(userInfo?.wallet_address ?? '')}
          >
            <IoCopyOutline size={17} />
            <p>{t('copy.wallet.address')}</p>
          </PopoverContent>
        </Popover>
      </div>
      <div className="w-full h-48 pt-2">
        <FollowMoblie />
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <MemexAvatar
            userInfo={userInfo}
            isOtherUser={isOtherUser}
            update={update}
            refetchUserInfo={refetchUserInfo}
          />
          <span className="text-2xl font-bold">{userInfo?.name}</span>
          <div className="flex space-x-4 items-center">
            <HoverCardPop content={t('account.total-likes')}>
              <span className="inline-flex items-center text-red-500">
                <HeartFilledIcon className="mr-1" /> {userInfo?.like_count || 0}
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
                    'hover:underline-offset-1 hover:underline outline-black cursor-pointer',
                  !isOtherUser &&
                    'max-sm:underline-offset-1 max-sm:text-blue-600 max-sm:underline'
                )}
              >
                <DiamondIcon size={17} />
                <span className="font-bold">
                  {fmt.decimals(userInfo?.reward_amount) || 0}
                </span>
                <p
                  className="max-sm:hidden text-sm text-blue-600 cursor-pointer hover:underline ml-2 underline"
                  onClick={() => router.push(Routes.Reward)}
                >
                  ({t('reward.rule')})
                </p>
              </span>
            </HoverCardPop>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountInfoMoblie
