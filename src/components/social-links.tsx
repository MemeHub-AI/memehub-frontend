import React, { ComponentProps } from 'react'
import { Twitter } from 'lucide-react'
import { VariantProps } from 'class-variance-authority'
import { useTranslation } from 'react-i18next'
import { LiaTelegramPlane } from 'react-icons/lia'

import { Button, buttonVariants } from './ui/button'
import { cn } from '@/lib/utils'
import { SOCIAL_LINKS } from '@/config/link'

export const SocialLinks = ({
  className,
  size = 'icon',
}: ComponentProps<'div'> & VariantProps<typeof buttonVariants>) => {
  const { t } = useTranslation()

  const links = [
    {
      name: t('twitter-x'),
      icon: <Twitter strokeWidth={1.5} size={20} />,
      link: SOCIAL_LINKS.x,
    },
    {
      name: t('telegram'),
      icon: <LiaTelegramPlane size={20} />,
      link: SOCIAL_LINKS.tg,
    },
  ]

  return (
    <div className={cn('flex items-start', className)}>
      {links.map((l, i) => (
        <Button
          key={i}
          size={size}
          variant="ghost"
          shadow="none"
          className="w-full gap-2 px-2 justify-start items-start max-sm:!px-0 max-sm:py-2"
          onClick={() => {
            if (l.link) open(l.link)
          }}
        >
          {l.icon}
          {l.name}
        </Button>
      ))}
    </div>
  )
}

export default SocialLinks
