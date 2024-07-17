import React from 'react'
import { Twitter } from 'lucide-react'
import { FaTelegramPlane } from 'react-icons/fa'
import { RiGlobalLine } from 'react-icons/ri'

import { useTokenContext } from '@/contexts/token'
import { Button } from '@/components/ui/button'

const classes = 'border-transparent hover:border-black hover:bg-transparent'

export const TokenLinks = () => {
  const { tokenInfo } = useTokenContext()

  return (
    <div className="flex justify-center items-center my-1 max-sm:m-0 space-x-1">
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
