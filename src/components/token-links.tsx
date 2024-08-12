import React, { ComponentProps } from 'react'
import { LuTwitter } from 'react-icons/lu'
import { FaTelegramPlane } from 'react-icons/fa'
import { RiGlobalLine } from 'react-icons/ri'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Props extends ComponentProps<'div'> {
  x?: string
  tg?: string
  website?: string
  buttonProps?: ComponentProps<typeof Button>
}

export const TokenSocialLinks = ({
  className,
  x,
  tg,
  website,
  buttonProps,
}: Props) => {
  const { className: buttonClass } = buttonProps ?? {}
  const links = [
    {
      title: 'Twitter',
      link: x,
      icon: <LuTwitter size={20} />,
    },
    {
      title: 'Telegram',
      link: tg,
      icon: <FaTelegramPlane size={20} />,
    },
    {
      title: 'Website',
      link: website,
      icon: <RiGlobalLine size={20} />,
    },
  ]

  return (
    <div
      className={cn(
        'flex justify-center items-center mt-1 space-x-1',
        className
      )}
    >
      {links.map(({ title, link, icon }) =>
        !!link ? (
          <Button
            shadow="none"
            size="icon"
            title={title}
            onClick={() => open(link)}
            className={cn(
              'border-transparent !bg-transparent hover:border-black',
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

export default TokenSocialLinks
