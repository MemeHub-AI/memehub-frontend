import React, { ComponentProps } from 'react'
import { Twitter } from 'lucide-react'
import { FaTelegramPlane } from 'react-icons/fa'
import { RiGlobalLine } from 'react-icons/ri'

import { useTokenContext } from '@/contexts/token'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const classes = 'border-transparent !bg-transparent hover:border-black'

export const TokenLinks = ({ className }: ComponentProps<'div'>) => {
  const { tokenInfo } = useTokenContext()

  return (
    <div
      className={cn(
        'flex justify-center items-center mt-1 space-x-1',
        className
      )}
    >
      {tokenInfo?.twitter_url && (
        <Button
          shadow="none"
          size="icon"
          title="twitter"
          onClick={() => open(tokenInfo.twitter_url)}
          className={classes}
        >
          <Twitter size={20} />
        </Button>
      )}
      {tokenInfo?.telegram_url && (
        <Button
          shadow="none"
          size="icon"
          title="telegram"
          onClick={() => open(tokenInfo?.telegram_url)}
          className={classes}
        >
          <FaTelegramPlane size={20} />
        </Button>
      )}
      {tokenInfo?.website && (
        <Button
          shadow="none"
          size="icon"
          title="website"
          onClick={() => open(tokenInfo?.website)}
          className={classes}
        >
          <RiGlobalLine size={20} />
        </Button>
      )}
    </div>
  )
}

export default TokenLinks
