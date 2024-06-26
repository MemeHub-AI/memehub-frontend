import React, { ComponentProps, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { lowerCase } from 'lodash'
import { useRouter } from 'next/router'

import { useTradeLogs } from '@/hooks/use-trade-logs'
import { cn } from '@/lib/utils'
import { Routes } from '@/routes'
import { fmt } from '@/utils/fmt'
import { Avatar } from './ui/avatar'
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@/components/ui/hover-card'
import { Button } from './ui/button'
import { CirclePing } from './circle-ping'
import { TradeType } from '@/constants/trade'

export const TradeLogs = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { isLatest, lastTrade, lastCreate } = useTradeLogs()

  return (
    <div className="flex items-center gap-2">
      {lastTrade && (
        <LogCard isPing={isLatest} trigger={t('log.trade')}>
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => {
              const href = fmt.toHref(Routes.Account, lastTrade.wallet_address)
              router.push(href)
            }}
          >
            <Avatar src={lastTrade.logo} size={24} />
            <span className="font-bold hover:underline">{lastTrade.name}</span>
          </div>
          <div className="mx-1">
            {lowerCase(
              lastTrade.type === TradeType.Buy ? t('bought') : t('sold')
            )}
          </div>
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => {
              const href = fmt.toHref(
                Routes.Main,
                lastTrade.chain_name,
                lastTrade.base_address
              )
              router.push(href)
            }}
          >
            <Avatar src={lastTrade.coin_logo} size={24} />
            <span className="font-bold hover:underline">
              {lastTrade.base_symbol}
            </span>
          </div>
        </LogCard>
      )}
      {lastCreate && (
        <LogCard isPing={isLatest} trigger={t('log.create')}>
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => {
              const href = fmt.toHref(
                Routes.Account,
                lastCreate.creator.wallet_address
              )
              router.push(href)
            }}
          >
            <Avatar src={lastCreate.creator.logo} size={24} />
            <span className="font-bold hover:underline">
              {lastCreate.creator.name}
            </span>
          </div>
          <div className="mx-1">{t('log.created')}</div>
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => {
              const href = fmt.toHref(
                Routes.Main,
                lastCreate.chain.name,
                lastCreate.address
              )
              router.push(href)
            }}
          >
            <Avatar src={lastCreate.image} size={24} />
            <span className="font-bold hover:underline">
              {lastCreate.ticker}
            </span>
          </div>
        </LogCard>
      )}
    </div>
  )
}

interface TagProps extends ComponentProps<typeof HoverCardContent> {
  isPing: boolean
  trigger: ReactNode
}

const LogCard = (props: TagProps) => {
  const { isPing, trigger, className, children } = props

  return (
    <HoverCard openDelay={0} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Button variant="outline" shadow="none" className="relative">
          {trigger}
          {isPing && <CirclePing />}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent
        className={cn(
          'px-3 py-3 border-2 border-black rounded-md flex items-center gap-1 w-[unset]',
          className
        )}
      >
        {children}
      </HoverCardContent>
    </HoverCard>
  )
}

export default TradeLogs
