import React, { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

export const Title = ({ className, children }: ComponentProps<'h2'>) => {
  return (
    <h2
      className={cn(
        'font-bold text-3xl my-8 relative max-sm:w-full max-sm:my-4 max-sm:text-2xl',
        className
      )}
    >
      {children}
    </h2>
  )
}

export default Title
