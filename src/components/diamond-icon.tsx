import React, { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

interface Props extends ComponentProps<'img'> {
  type?: 'diamond' | 'diamond-star'
  size?: number
}

export const DiamondIcon = ({
  type = 'diamond',
  className,
  size = 28,
}: Props) => {
  return (
    <img
      src={`/images/reward/${type}.png`}
      alt="diamond"
      className={cn('w-6 h-6', className)}
      style={{ width: size, height: size }}
    />
  )
}

export default DiamondIcon
