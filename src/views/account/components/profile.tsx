import React, { useState, type ComponentProps } from 'react'
import {
  Pencil2Icon,
  HeartFilledIcon,
  EnvelopeClosedIcon,
  PlusIcon,
  MinusIcon,
} from '@radix-ui/react-icons'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { isEmpty } from 'lodash'

import {
  Card,
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
import { useUserStore } from '@/stores/use-user-store'
import { Dialog } from '@/components/ui/dialog'
import { useUploadImage } from '@/hooks/use-upload-image'
import { ImageUpload } from '@/components/image-upload'

export const Profile = (props: ComponentProps<'div'>) => {
  const { className } = props
  const { t } = useTranslation()
  const { query } = useRouter()
  const [open, setOpen] = useState(false)

  const { userInfo, isOtherUser, refetchUserInfo } = useAccountContext()
  const { isFollowed } = useUserStore()
  const { isFollowing, isUnfollowing, follow, unfollow, update } = useUser()
  const tokenAddr = (query.address || '') as string
  const isFollow = isFollowed(tokenAddr)

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
          />
          {!isOtherUser && (
            <>
              <Pencil2Icon
                width={26}
                height={26}
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
          <CardDescription>
            {fmt.addr(userInfo?.wallet_address)}
          </CardDescription>
          <CardDescription className="break-all line-clamp-2">
            {userInfo?.description}
          </CardDescription>
        </div>
        {isOtherUser ? (
          <Button
            size="icon"
            variant="outline"
            className="absolute right-4 top-2"
            disabled={isFollowing || isUnfollowing}
            onClick={() => (isFollow ? unfollow(tokenAddr) : follow(tokenAddr))}
          >
            {isFollow ? <MinusIcon /> : <PlusIcon />}
          </Button>
        ) : (
          <ProfileForm>
            <Button
              size="icon"
              variant="outline"
              className="absolute right-4 top-2"
            >
              <Pencil2Icon />
            </Button>
          </ProfileForm>
        )}
      </CardHeader>
      {/* <CardContent className="py-0 px-4"></CardContent> */}
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="flex items-center gap-1 text-zinc-500 text-sm">
          {t('account.total-likes')}:
          <span className="inline-flex items-center gap-1 text-red-500">
            {userInfo?.like_count || 0} <HeartFilledIcon />
          </span>
        </div>
        <div className="flex items-center gap-1 text-sm text-zinc-500 cursor-pointer">
          {t('account.total-mentions')}:
          <span className="inline-flex items-center gap-1 text-black">
            {userInfo?.mention_count || 0} <EnvelopeClosedIcon />
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}

export default Profile
