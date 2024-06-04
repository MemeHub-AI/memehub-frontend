import React, { ComponentProps } from 'react'
import { Send, Twitter } from 'lucide-react'
import { VariantProps } from 'class-variance-authority'
import { useTranslation } from 'react-i18next'

import { Button, buttonVariants } from './ui/button'
import { cn } from '@/lib/utils'

export const SocialLinks = ({
  className,
  size = 'icon',
}: ComponentProps<'div'> & VariantProps<typeof buttonVariants>) => {
  const { t } = useTranslation()

  const links = [
    { name: t('twitter-x'), icon: <Twitter strokeWidth={1.5} size={22} /> },
    { name: t('telegram'), icon: <Send strokeWidth={1.5} size={21} /> },
  ]

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {links.map((l, i) => (
        <Button key={i} size={size} className="w-full gap-2">
          {l.icon}
          {l.name}
        </Button>
      ))}
    </div>
  )
}

export default SocialLinks
