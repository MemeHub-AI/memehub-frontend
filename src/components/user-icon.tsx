import React, { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

interface Props extends ComponentProps<'img'> {
  type?: 'diamond' | 'diamond-star'
  size?: number
}

export const UserIcon = ({ className, size = 28 }: Props) => {
  return (
    <img
      src="/images/reward/user.png"
      alt="icon"
      className={cn('', className)}
      style={{
        width: size,
        height: size,
      }}
    />
  )
}

export default UserIcon
