import React, { ComponentProps } from 'react'

import { Img } from './img'
import { cn } from '@/lib/utils'

interface Props extends ComponentProps<'img'> {
  containerClass?: string
  imgClass?: string
  iconClass?: string
}

export const IdTag = ({
  src,
  title,
  className,
  containerClass,
  iconClass,
  imgClass,
  onClick,
}: Props) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between rounded bg-lime-green',
        className
      )}
      onClick={onClick}
    >
      <div className={cn('flex items-center', containerClass)}>
        <Img
          src={src}
          alt="avatar"
          className={cn('w-10 h-10 shrink-0 rounded-r-none', imgClass)}
        />
        <span className="mx-2 truncate w-[80%] hover:underline">{title}</span>
      </div>
      <img
        src="/images/check.png"
        alt="Avatar"
        className={cn('w-10 h-10 p-2', iconClass)}
      />
    </div>
  )
}

export default IdTag
