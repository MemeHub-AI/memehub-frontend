import React, { type ComponentProps } from 'react'
import { useAccount } from 'wagmi'
import {
  Pencil2Icon,
  HeartFilledIcon,
  EnvelopeClosedIcon,
} from '@radix-ui/react-icons'

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

export const Profile = (props: ComponentProps<'div'>) => {
  const { className } = props
  const { address } = useAccount()

  return (
    <Card className={cn('min-w-aside', className)} hover="none">
      <CardHeader className="flex-row gap-4 relative p-4">
        <Label
          htmlFor="avatar-edit"
          className={cn(
            "relative group after:content-[''] after:absolute after:inset-0 cursor-pointer",
            'after:rounded-full hover:after:bg-black/50 after:transition-all'
          )}
        >
          <Avatar
            src="https://i.pravatar.cc/150?img=1"
            fallback="L1en"
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
          <CardTitle>L1en</CardTitle>
          <CardDescription>{fmt.addr(address)}</CardDescription>
          <CardDescription>Frontend developer</CardDescription>
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
          Total likes:
          <span className="inline-flex items-center gap-1 text-red-500">
            0 <HeartFilledIcon />
          </span>
        </div>
        <div className="flex items-center gap-1 text-sm text-zinc-500 cursor-pointer">
          Total mentions:
          <span className="inline-flex items-center gap-1 text-black">
            0 <EnvelopeClosedIcon />
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}

export default Profile
