import { UserInfoRes, UserUpdateReq } from '@/api/user/types'
import MemexAvatar from './memex-avatar'
import { UseMutateAsyncFunction } from '@tanstack/react-query'
import { ApiResponse } from '@/api/types'
import FollowDesktop from '@/views/account/components/follow-desktop'
import { AccountInfoProps, HoverCardPop } from './memex-profile'
import { useTranslation } from 'react-i18next'
import {
  EnvelopeClosedIcon,
  HeartFilledIcon,
  MinusIcon,
  PlusIcon,
} from '@radix-ui/react-icons'
import router from 'next/router'
import { Routes } from '@/routes'
import { cn } from '@/lib/utils'
import DiamondIcon from '@/components/diamond-icon'
import { Button } from '@/components/ui/button'
import ProfileForm from '@/views/account/components/profile-form'
import { IoCopyOutline, IoSettingsOutline } from 'react-icons/io5'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover'
import { IoMdMore } from 'react-icons/io'
import { useClipboard } from '@/hooks/use-clipboard'

export const AccountInfoDesktop = (props: AccountInfoProps) => {
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
          <FollowDesktop />

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
  )
}

export default AccountInfoDesktop
