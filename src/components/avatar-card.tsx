import React, { ComponentProps, ReactNode, useState } from 'react'

import { Card } from './ui/card'
import { cn } from '@/lib/utils'
import { Dialog } from './ui/dialog'
import { Avatar } from './ui/avatar'

interface Props extends ComponentProps<typeof Card> {
  src?: string
  avatarChildren?: ReactNode
}

export const AvatarCard = ({
  className,
  children,
  src,
  avatarChildren,
  ...props
}: Props) => {
  const [open, setOpen] = useState(false)
  return (
    <Card
      shadow="none"
      padding="md"
      className={cn(
        'mt-12 bg-lime-green-deep cursor-default max-sm:mt-14 relative',
        className
      )}
      {...props}
    >
      <Dialog
        open={open}
        onOpenChange={setOpen}
        contentProps={{ className: 'p-0 break-all' }}
      >
        <img src={src} alt="logo" />
      </Dialog>
      <div className="relative">
        <Avatar
          src={src}
          variant="border"
          alt="logo"
          className="w-28 h-28 cursor-pointer absolute -top-16 left-1/2 -translate-x-1/2 bg-white"
        />
        {avatarChildren}
      </div>
      {children}
    </Card>
  )
}

export default AvatarCard
