import React, { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

interface DiamondIconProps extends ComponentProps<'img'> {
  type?: 'diamond' | 'diamond-star'
  size?: number
}

export const DiamondIcon = React.forwardRef<HTMLImageElement, DiamondIconProps>(
  (props, ref) => {
    const { type = 'diamond', className, size = 28 } = props

    return (
      <img
        src={`/images/reward/${type}.png`}
        alt="diamond"
        className={cn('w-6 h-6', className)}
        style={{ width: size, height: size }}
        ref={ref}
      />
    )
  }
)

export default DiamondIcon
