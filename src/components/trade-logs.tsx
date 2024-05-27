import React, { ComponentProps, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import dayjs from 'dayjs'

import { useTradeLogs } from '@/hooks/use-trade-logs'
import { cn } from '@/lib/utils'
import { Routes } from '@/routes'
import { fmt } from '@/utils/fmt'
import { TradeType } from '@/api/websocket/types'

export const TradeLogs = () => {
  const { t } = useTranslation()
  const { isLatest, lastTrade, lastCreate } = useTradeLogs()

  return (
    <div className="flex items-center gap-2">
      {lastTrade && (
        <Tag
          flash={isLatest}
          userLabel={fmt.addr(lastTrade.wallet_address)}
          userAddr={lastTrade.wallet_address}
          text={(lastTrade.type === TradeType.Buy
            ? t('bought')
            : t('sold')
          ).toLowerCase()}
          tokenLabel={lastTrade.quote_symbol}
          tokenAddr={lastTrade.quote_amount}
        />
      )}
      {lastCreate && (
        <Tag
          flash={isLatest}
          userLabel={lastCreate.wallet_address}
          userAddr={lastCreate.wallet_address}
          text={t('created').toLowerCase()}
          tokenLabel={lastCreate.symbol}
          tokenAddr={lastCreate.symbol}
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
        href={`${Routes.Token}/${tokenAddr}`}
        className="hover:underline hover:text-blue-600"
      >
        {tokenLabel}
      </Link>
      {suffix}
    </div>
  )
}

export default TradeLogs
