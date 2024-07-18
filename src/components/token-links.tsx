import React, { ComponentProps } from 'react'
import { Twitter } from 'lucide-react'
import { FaTelegramPlane } from 'react-icons/fa'
import { RiGlobalLine } from 'react-icons/ri'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const classes = 'border-transparent !bg-transparent hover:border-black'

interface Props extends ComponentProps<'div'> {
  x?: string
  tg?: string
  website?: string
}

export const TokenSocialLinks = ({ className, x, tg, website }: Props) => {
  return (
    <div
      className={cn(
        'flex justify-center items-center mt-1 space-x-1',
        className
      )}
    >
      {x && (
        <Button
          shadow="none"
          size="icon"
          title="twitter"
          onClick={() => open(x)}
          className={classes}
        >
          <Twitter size={20} />
        </Button>
      )}
      {tg && (
        <Button
          shadow="none"
          size="icon"
          title="telegram"
          onClick={() => open(tg)}
          className={classes}
        >
          <FaTelegramPlane size={20} />
        </Button>
      )}
      {website && (
        <Button
          shadow="none"
          size="icon"
          title="website"
          onClick={() => open(website)}
          className={classes}
        >
          <RiGlobalLine size={20} />
        </Button>
      )}
    </div>
  )
}

export default TokenSocialLinks
