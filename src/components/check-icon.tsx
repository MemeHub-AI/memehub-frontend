import { cn } from '@/lib/utils'
import React, { ComponentProps } from 'react'

export const CheckIcon = ({ className, ...props }: ComponentProps<'img'>) => {
  return (
    <img
      src="/images/check.png"
      alt="check"
      className={cn('p-2 w-11 h-11', className)}
      {...props}
    />
  )
}

export default CheckIcon
