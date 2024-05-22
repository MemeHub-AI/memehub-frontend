import React, { type ComponentProps } from 'react'
import {
  Pencil2Icon,
  HeartFilledIcon,
  EnvelopeClosedIcon,
} from '@radix-ui/react-icons'
import { useTranslation } from 'react-i18next'

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
import { Input } from '@/components/ui/input'
import { ProfileForm } from './profile-form'
import { useUserStore } from '@/stores/use-user-store'
import { useAccountContext } from '@/contexts/account'

export const Profile = (props: ComponentProps<'div'>) => {
  const { className } = props
  const { t } = useTranslation()
  const { userInfo } = useAccountContext()

  return (
    <Card className={cn('w-aside', className)} hover="none">
      <CardHeader className="flex-row gap-4 relative p-4">
        <Label
          htmlFor="avatar-edit"
          className={cn(
            "relative group after:content-[''] after:absolute after:inset-0 cursor-pointer",
            'after:rounded-full hover:after:bg-black/50 after:transition-all'
          )}
        >
          <Avatar
            src={userInfo?.logo || ''}
            fallback={userInfo?.wallet_address.slice(-4)}
            size={64}
          />
          <Pencil2Icon
            width={26}
            height={26}
            className={cn(
              'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
              'z-50 opacity-0 group-hover:opacity-100 transition-all text-white'
            )}
          />
          <Input id="avatar-edit" type="file" className="absolute invisible" />
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
        {/* Editing profile. */}
        <ProfileForm>
          <Button
            size="icon"
            variant="outline"
            className="absolute right-4 top-2"
          >
            <Pencil2Icon />
          </Button>
        </ProfileForm>
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
