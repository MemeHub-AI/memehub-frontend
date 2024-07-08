import React, { useState, type ComponentProps, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Copy, Twitter, Check } from 'lucide-react'
import { FaTelegramPlane } from 'react-icons/fa'
import { RiGlobalLine } from 'react-icons/ri'
import { BigNumber } from 'bignumber.js'

import { cn } from '@/lib/utils'
import { Dialog } from '@/components/ui/dialog'
import { useTokenContext } from '@/contexts/token'
import { useClipboard } from '@/hooks/use-clipboard'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { fmt } from '@/utils/fmt'
import { utilLang } from '@/utils/lang'
import { LISTED_MARKET_CAP } from '@/constants/trade'
import { useResponsive } from '@/hooks/use-responsive'
import { Badge } from '@/components/ui/badge'
import { usePools } from '../hooks/use-pools'
import { useChainsStore } from '@/stores/use-chains-store'

export const TokenInfo = ({ className }: ComponentProps<'div'>) => {
  const { t } = useTranslation()
  const [details, setDetails] = useState<ReactNode>(null)
  const { tokenInfo, isLoadingTokenInfo, isNotFound } = useTokenContext()
  const { isCopied, copy } = useClipboard()
  const { isMobile } = useResponsive()
  const { isGrauated } = usePools(tokenInfo?.address)
  const { findChain } = useChainsStore()
  const chain = findChain(tokenInfo?.chain?.name)

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
          'mt-20 bg-lime-green-deep cursor-default max-sm:mt-14 relative',
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
        {/* Chain logo */}
        <div className="absolute left-2 top-2 flex items-center gap-1">
          <Avatar src={chain?.logo} size={20} />
          <p className="text-sm max-w-20 break-all">{chain?.displayName}</p>
        </div>
        {/* Logo */}
        <div className="relative">
          <Avatar
            src={tokenInfo?.image}
            variant="border"
            alt="logo"
            className="w-28 h-28 cursor-pointer absolute -top-16 left-1/2 -translate-x-1/2 bg-white"
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
          {isGrauated && (
            <Badge
              variant="success"
              className="absolute -bottom-14 left-1/2 -translate-x-1/2 border-black"
            >
              {t('token.graduated')}
            </Badge>
          )}
        </div>
        {/* Name/symbol */}
        <div className="font-bold leading-none text-center pt-16 max-sm:pt-14">
          {isNotFound
            ? t('token.not-found')
            : `${tokenInfo?.name}(${tokenInfo?.ticker})`}
        </div>
        {/* Links */}
        <div className="flex justify-center items-center my-1 max-sm:m-0">
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
        {/* Description */}
        <div
          className={cn(
            'text-sm mt-1 break-all cursor-pointer',
            (tokenInfo?.twitter_url ||
              tokenInfo?.telegram_url ||
              tokenInfo?.website) &&
              'max-sm:mt-0'
          )}
          onClick={() => {
            setDetails(<p className="p-8"> {tokenInfo?.desc}</p>)
          }}
        >
          {tokenInfo?.desc}
        </div>
        {/* Contract address */}
        {!isMobile && !isNotFound && (
          <div
            className="text-sm flex items-center cursor-pointer my-3"
            onClick={() => copy(tokenInfo?.address || '')}
          >
            <span>{t('ca')}:</span>
            <span className="truncate mx-2">
              {fmt.addr(tokenInfo?.address || '', { len: 12 })}
            </span>
            {isCopied ? <Check size={16} /> : <Copy size={16} />}
          </div>
        )}
        {/* Bonding curve description */}
        {isNotFound ? (
          <p className="text-xs text-zinc-500 max-sm:mt-2">
            {t('token.not-found-desc')}
          </p>
        ) : (
          <p className="text-xs text-zinc-500 max-sm:mt-2">
            {isGrauated
              ? t('token.graduated-desc')
              : utilLang.replace(t('bonding-curve.desc'), [
                  BigNumber(LISTED_MARKET_CAP).toFormat(),
                ])}
          </p>
        )}
      </Card>
    </>
  )
}

export default TokenInfo
