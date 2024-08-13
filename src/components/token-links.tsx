import React, { ComponentProps } from 'react'
import { FaTelegramPlane } from 'react-icons/fa'
import { FaTwitter } from 'react-icons/fa'
import { FaGlobe } from 'react-icons/fa'

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
  ...props
}: Props) => {
  const { className: buttonClass } = buttonProps ?? {}
  const links = [
    {
      title: 'Twitter',
      link: x,
      icon: <FaTwitter size={20} />,
    },
    {
      title: 'Telegram',
      link: tg,
      icon: <FaTelegramPlane size={22} />,
    },
    {
      title: 'Website',
      link: website,
      icon: <FaGlobe size={18} />,
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
