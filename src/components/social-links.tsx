import React, { type ComponentProps } from 'react'
import { FaTelegramPlane } from 'react-icons/fa'
import { FaGlobe } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { parseMediaUrl } from '@/utils'
import { AiFillBook } from 'react-icons/ai'

interface Props extends ComponentProps<'div'> {
  x?: string
  tg?: string
  website?: string
  gitbook?: string
  buttonProps?: ComponentProps<typeof Button>
  size?: number
}

export const SocialLinks = ({
  className,
  x,
  tg,
  website,
  gitbook,
  buttonProps,
  size = 20,
  ...props
}: Props) => {
  const { className: buttonClass } = buttonProps ?? {}
  const links = [
    {
      title: 'Twitter',
      link: parseMediaUrl('x', x),
      icon: <FaXTwitter size={size} />,
    },
    {
      title: 'Telegram',
      link: parseMediaUrl('tg', tg),
      icon: <FaTelegramPlane size={size} />,
    },
    {
      title: 'Website',
      link: parseMediaUrl('website', website),
      icon: <FaGlobe size={size} />,
    },
    {
      title: 'GitBook',
      link: parseMediaUrl('gitbook', gitbook),
      icon: <AiFillBook size={size} />,
    },
  ]

  return (
    <div
      className={cn(
        'flex justify-center items-center mt-1 space-x-1',
        className
      )}
      {...props}
    >
      {links.map(({ title, link, icon }) =>
        !!link ? (
          <Button
            type="button"
            key={title}
            shadow="none"
            size="icon"
            title={title}
            onClick={() => open(link)}
            className={cn(
              'border-transparent !bg-transparent sm:hover:border-black',
              buttonClass
            )}
            {...buttonProps}
          >
            {icon}
          </Button>
        ) : null
      )}
    </div>
  )
}

export default SocialLinks
