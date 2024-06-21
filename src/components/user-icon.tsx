import React, { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

interface Props extends ComponentProps<'img'> {
  type?: 'user' | 'user2'
  size?: number
}

export const UserIcon = ({ className, size = 28, type = 'user' }: Props) => {
  return (
    <img
      src={`/images/reward/${type}.png`}
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
