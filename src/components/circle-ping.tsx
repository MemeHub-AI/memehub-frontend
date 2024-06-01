import React, { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

interface Props extends ComponentProps<'span'> {
  size?: number
  dotClass?: string
  pingClass?: string
}

export const CirclePing = (props: Props) => {
  const { size = 12, className, dotClass, pingClass, ...resetProps } = props

  return (
    <span
      className={cn('absolute -top-1 -right-1 flex h-3 w-3', className)}
      style={{ width: size, height: size }}
      {...resetProps}
    >
      <span
        className={cn(
          'animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75',
          pingClass
        )}
      ></span>
      <span
        style={{ width: size, height: size }}
        className={cn(
          'relative inline-flex rounded-full h-3 w-3 bg-red-500',
          dotClass
        )}
      ></span>
    </span>
  )
}

export default CirclePing
