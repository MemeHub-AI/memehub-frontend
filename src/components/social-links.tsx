import React, { ComponentProps } from 'react'
import { Send, Twitter } from 'lucide-react'

import { Button } from './ui/button'
import { cn } from '@/lib/utils'

export const SocialLinks = ({ className }: ComponentProps<'div'>) => {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Button size="icon">
        <Send strokeWidth={1.5} size={21} />
      </Button>
      <Button size="icon">
        <Twitter strokeWidth={1.5} size={22} />
      </Button>
    </div>
  )
}

export default SocialLinks
