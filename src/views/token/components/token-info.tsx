import React, { useState, type ComponentProps, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Copy, Twitter, Check } from 'lucide-react'
import { FaTelegramPlane } from 'react-icons/fa'
import { RiGlobalLine } from 'react-icons/ri'

import { cn } from '@/lib/utils'
import { Dialog } from '@/components/ui/dialog'
import { useTokenContext } from '@/contexts/token'
import { useClipboard } from '@/hooks/use-clipboard'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { fmt } from '@/utils/fmt'

export const TokenInfo = ({ className }: ComponentProps<'div'>) => {
  const { t } = useTranslation()
  const [details, setDetails] = useState<ReactNode>(null)
  const { tokenInfo, isLoadingTokenInfo } = useTokenContext()
  const { isCopied, copy } = useClipboard()

  if (isLoadingTokenInfo) {
    return (
      <>
        <div className={cn('flex gap-3 items-start mt-4', className)}>
          <Skeleton className="w-36 h-36 shrink-0" />
          <div className="flex flex-col gap-2 w-full">
            <Skeleton className="w-1/2 h-5" />
            <Skeleton className="w-full h-3" />
            <Skeleton className="w-3/4 h-3" />
            <Skeleton className="w-2/3 h-3" />
          </div>
        </div>
        <Skeleton className="w-full h-5 mt-3 rounded-full" />
        <Skeleton className="w-full h-3 mt-2 mb-1" />
        <Skeleton className="w-full h-3 mb-1" />
        <Skeleton className="w-2/3 h-3" />
        <div className="mt-5">
          <h3 className="font-bold text-base text-black">{t('ca')}:</h3>
          <Skeleton className="w-full h-3 mt-1" />
        </div>
      </>
    )
  }

  return (
    <>
      <Card
        shadow="none"
        padding="md"
        className={cn(
          'flex gap-3 items-start mt-20 bg-lime-green-deep cursor-default',
          className
        )}
      >
        <Dialog
          open={!!details}
          onOpenChange={() => setDetails(null)}
          contentProps={{ className: 'p-0 break-all' }}
        >
          {details}
        </Dialog>

        <div className="relative mt-">
          <Avatar
            src={tokenInfo?.image}
            variant="border"
            alt="logo"
            className="w-28 h-28 cursor-pointer absolute -top-1/2 left-1/2 -translate-x-1/2"
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
          <div className="font-bold leading-none text-center pt-14">
            {tokenInfo?.name}({tokenInfo?.ticker})
          </div>
          {/* Links */}
          <div className="flex justify-center items-center my-1">
            {tokenInfo?.twitter_url && (
              <Button
                variant="ghost"
                size="icon"
                shadow="none"
                onClick={() => open(tokenInfo.twitter_url)}
                title="twitter"
              >
                <Twitter size={20} />
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
                <FaTelegramPlane size={20} />
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
                <RiGlobalLine size={20} />
              </Button>
            )}
          </div>
          {/* Contract address */}
          <div
            className="text-sm flex justify-center items-center gap-2 cursor-pointer font-bold"
            onClick={() => copy(tokenInfo?.address || '')}
          >
            <span>{t('ca')}:</span>
            <span className="truncate">
              {fmt.addr(tokenInfo?.address || '', { len: 14 })}
            </span>
            {isCopied ? <Check size={16} /> : <Copy size={16} />}
          </div>
          <div
            className="text-sm mt-1 break-all cursor-pointer"
            onClick={() => {
              setDetails(<p className="p-8"> {tokenInfo?.desc}</p>)
            }}
          >
            {tokenInfo?.desc}
          </div>
        </div>
      </Card>
    </>
  )
}

export default TokenInfo
