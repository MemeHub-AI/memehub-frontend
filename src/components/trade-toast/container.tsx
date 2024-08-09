import { type ComponentProps } from 'react'

import { cn } from '@/lib/utils'
import { CloseButton } from './close-button'

export const Container = ({ className, children }: ComponentProps<'div'>) => {
  return (
    <div className={cn('w-full relative text-[15px] min-h-[107px]', className)}>
      <CloseButton />
      {children}
    </div>
  )
}
