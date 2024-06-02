import React, { ComponentProps, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import dayjs from 'dayjs'

import { useTradeLogs } from '@/hooks/use-trade-logs'
import { cn } from '@/lib/utils'
import { Routes } from '@/routes'
import { TradeType } from '@/api/websocket/types'
import { useAccount } from 'wagmi'

export const TradeLogs = () => {
  const { t } = useTranslation()
  const { isLatest, lastTrade, lastCreate } = useTradeLogs()

  return (
    <div className="flex items-center gap-2">
      {lastTrade && (
        <Tag
          flash={isLatest}
          userLabel={lastTrade.name}
          userAddr={lastTrade.wallet_address}
          text={(lastTrade.type === TradeType.Buy
            ? t('bought')
            : t('sold')
          ).toLowerCase()}
          tokenLabel={lastTrade.quote_symbol}
          tokenAddr={lastTrade.quote_address}
        />
      )}
      {lastCreate && (
        <Tag
          flash={isLatest}
          userLabel={lastCreate.creator.name}
          userAddr={lastCreate.creator.wallet_address}
          text={t('created').toLowerCase()}
          tokenLabel={lastCreate.ticker}
          tokenAddr={lastCreate.address}
          suffix={`${t('at').toLowerCase()}${dayjs(
            lastCreate.create_time
          ).fromNow()}`}
        />
      )}
    </div>
  )
}

interface Props extends ComponentProps<'div'> {
  userLabel: string
  userAddr: string
  text: ReactNode
  tokenLabel: string
  tokenAddr: string
  flash: boolean
  suffix?: ReactNode
}

const Tag = (props: Props) => {
  const {
    className,
    userLabel,
    userAddr,
    text,
    tokenLabel,
    tokenAddr,
    flash,
    suffix,
  } = props
  const { chain } = useAccount()

  return (
    <div
      className={cn(
        'px-3 py-1.5 border rounded flex items-center gap-1',
        flash && 'animate-flash',
        className
      )}
    >
      <Link
        href={`${Routes.Account}/${userAddr}`}
        className="hover:underline hover:text-blue-600"
      >
        {userLabel}
      </Link>
      <span>{text}</span>
      <Link
        // TODO: should be dynamic chain
        href={`${Routes.Main}/${chain?.name}/${tokenAddr}`}
        className="hover:underline hover:text-blue-600"
      >
        {tokenLabel}
      </Link>
      {suffix}
    </div>
  )
}

export default TradeLogs
