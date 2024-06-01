import React, { useState, type ComponentProps, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Copy, Twitter } from 'lucide-react'
import { FaTelegramPlane } from 'react-icons/fa'
import { RiGlobalLine } from 'react-icons/ri'

import { cn } from '@/lib/utils'
import { Dialog } from '@/components/ui/dialog'
import { useTokenContext } from '@/contexts/token'
import { useClipboard } from '@/hooks/use-clipboard'
import { Button } from '@/components/ui/button'

export const TokenInfo = ({ className }: ComponentProps<'div'>) => {
  const { t } = useTranslation()
  const [details, setDetails] = useState<ReactNode>(null)
  const { tokenInfo } = useTokenContext()
  const { copy } = useClipboard()
  const hasLink =
    tokenInfo?.twitter_url || tokenInfo?.telegram_url || tokenInfo?.website

  return (
    <>
      <div className={cn('flex gap-3 items-start mt-4', className)}>
        <Dialog
          open={!!details}
          onOpenChange={() => setDetails(null)}
          contentProps={{ className: 'p-0 break-all' }}
        >
          {details}
        </Dialog>

        <img
          src={tokenInfo?.image}
          alt="logo"
          className="w-36 h-36 object-cover rounded cursor-pointer"
          onClick={() => {
            setDetails(
              <img
                src={tokenInfo?.image}
                alt="logo"
                className="w-full object-contain"
              />
            )
          }}
        />
        <div className="break-all line-clamp-[9]">
          <div className="font-bold leading-none">
            {tokenInfo?.name}({tokenInfo?.ticker})
          </div>
          <div
            className="text-xs text-gray-400 mt-1 break-all cursor-pointer"
            onClick={() => {
              setDetails(<p className="p-8"> {tokenInfo?.desc}</p>)
            }}
          >
            {tokenInfo?.desc}
          </div>
        </div>
      </div>
      <div
        className="text-sm text-zinc-500 flex flex-col items-start mt-2 cursor-pointer"
        onClick={() => copy(tokenInfo?.address || '')}
      >
        <span>{t('ca')}:</span>
        <div className="w-full flex items-center">
          <span className="truncate">{tokenInfo?.address || ''}</span>
          <Copy size={16} />
        </div>
      </div>

      {hasLink && (
        <div className="flex justify-between items-center mt-3">
          {tokenInfo?.twitter_url && (
            <Button
              variant="ghost"
              size="icon"
              shadow="none"
              onClick={() => open(tokenInfo.twitter_url)}
              title="twitter"
            >
              <Twitter />
            </Button>
          )}
          {tokenInfo?.telegram_url && (
            <Button
              variant="ghost"
              size="icon"
              shadow="none"
              onClick={() => open(tokenInfo?.telegram_url)}
              title="telegram"
            >
              <FaTelegramPlane size={24} />
            </Button>
          )}
          {tokenInfo?.website && (
            <Button
              variant="ghost"
              size="icon"
              shadow="none"
              onClick={() => open(tokenInfo?.website)}
              title="website"
            >
              <RiGlobalLine size={24} />
            </Button>
          )}
        </div>
      )}
    </>
  )
}

export default TokenInfo
