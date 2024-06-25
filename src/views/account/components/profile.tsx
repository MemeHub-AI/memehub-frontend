import React, { useState, type ComponentProps } from 'react'
import {
  HeartFilledIcon,
  EnvelopeClosedIcon,
  PlusIcon,
  MinusIcon,
} from '@radix-ui/react-icons'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { isEmpty } from 'lodash'
import { AiOutlineEdit } from 'react-icons/ai'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { fmt } from '@/utils/fmt'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ProfileForm } from './profile-form'
import { useAccountContext } from '@/contexts/account'
import { useUser } from '@/hooks/use-user'
import { Dialog } from '@/components/ui/dialog'
import { useUploadImage } from '@/hooks/use-upload-image'
import { ImageUpload } from '@/components/image-upload'
import { RewardButton } from '@/components/reward-button'
import { Routes } from '@/routes'
import { Tooltip } from '@/components/ui/tooltip'
import { useClipboard } from '@/hooks/use-clipboard'

export const Profile = (props: ComponentProps<'div'>) => {
  const { className } = props
  const { t } = useTranslation()
  const { query, ...router } = useRouter()
  const [open, setOpen] = useState(false)

  const { userInfo, isOtherUser, refetchUserInfo } = useAccountContext()
  const { isFollowing, isUnfollowing, follow, unfollow, update } = useUser({
    onFollowFinlly: refetchUserInfo,
  })
  const tokenAddr = (query.address || '') as string
  const { copy } = useClipboard()

  const { onChangeUpload } = useUploadImage({
    onSuccess: (url) => update({ logo: url }).then(() => refetchUserInfo()),
  })

  return (
    <Card className={cn('w-aside', className)} hover="none" shadow="none">
      {/* Zoom in avatar dialog if is other user. */}
      <Dialog
        open={open}
        onOpenChange={setOpen}
        contentProps={{ className: 'max-w-[40vw]' }}
      >
        <img
          src={userInfo?.logo}
          alt="avatar"
          className="w-full h-full object-fill"
        />
      </Dialog>

      <CardHeader className="flex-row gap-4 relative p-4">
        <Label
          htmlFor="avatar-edit"
          className={cn(
            "relative group after:content-[''] after:absolute after:inset-0 cursor-pointer",
            !isOtherUser &&
              'after:rounded-full hover:after:bg-black/50 after:transition-all'
          )}
          onClick={() => {
            if (isOtherUser && !isEmpty(userInfo?.logo)) {
              setOpen(true)
            }
          }}
        >
          <Avatar
            src={userInfo?.logo || ''}
            fallback={userInfo?.wallet_address.slice(-4)}
            size={64}
            className="border-2 border-black"
          />
          {!isOtherUser && (
            <>
              <AiOutlineEdit
                size={26}
                className={cn(
                  'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                  'z-50 opacity-0 group-hover:opacity-100 transition-all text-white'
                )}
              />
              <ImageUpload
                id="avatar-edit"
                className="absolute invisible"
                onChange={onChangeUpload}
              />
            </>
          )}
        </Label>
        <div>
          <CardTitle>{userInfo?.name}</CardTitle>
          <Tooltip tip={t('click-to-copy')}>
            <CardDescription
              className="hover:underline cursor-pointer"
              onClick={() => copy(userInfo?.wallet_address ?? '')}
            >
              {fmt.addr(userInfo?.wallet_address, { len: 8 })}
            </CardDescription>
          </Tooltip>
          <CardDescription className="break-all line-clamp-2">
            {userInfo?.description}
          </CardDescription>
        </div>
        {isOtherUser ? (
          <Button
            size="icon"
            variant="outline"
            shadow="none"
            className="absolute right-4 top-2 hover:bg-zinc-200"
            disabled={isFollowing || isUnfollowing}
            onClick={() =>
              userInfo?.is_follower ? unfollow(tokenAddr) : follow(tokenAddr)
            }
          >
            {userInfo?.is_follower ? <MinusIcon /> : <PlusIcon />}
          </Button>
        ) : (
          <ProfileForm>
            <Button
              size="icon"
              variant="outline"
              shadow="none"
              className="absolute right-4 top-2 hover:bg-zinc-200"
            >
              <AiOutlineEdit size={20} />
            </Button>
          </ProfileForm>
        )}
      </CardHeader>

      <CardContent className="px-4 flex flex-col items-start gap-2 pb-3">
        <div className="flex items-center flex-wrap gap-2">
          <RewardButton shadow="none" className="border-none text-lg px-3" />
          <p
            className="text-sm text-blue-600 cursor-pointer hover:underline"
            onClick={() => router.push(Routes.Reward)}
          >
            {t('reward.rule')}
          </p>
        </div>
        <div className="text-sm text-zinc-500 cursor-pointer">
          <p onClick={() => copy(userInfo?.inviter.one ?? '')}>
            <span className="font-bold">{t('inviter1')}: </span>
            {fmt.addr(userInfo?.inviter.one, { len: 8 })}
          </p>
          <p onClick={() => copy(userInfo?.inviter.two ?? '')}>
            <span className="font-bold">{t('inviter2')}: </span>
            {fmt.addr(userInfo?.inviter.two, { len: 8 })}
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="flex items-center gap-1 text-zinc-500 text-sm">
          <span className="cursor-default">{t('account.total-likes')}:</span>
          <span className="inline-flex items-center gap-1 text-red-500">
            {userInfo?.like_count || 0} <HeartFilledIcon />
          </span>
        </div>
        <div className="flex items-center gap-1 text-sm text-zinc-500">
          <span>{t('account.total-mentions')}:</span>
          <span className="inline-flex items-center gap-1 text-black">
            {userInfo?.mention_count || 0} <EnvelopeClosedIcon />
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}

export default Profile
