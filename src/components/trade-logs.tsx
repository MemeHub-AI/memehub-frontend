import React from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'

import { useTradeLogs } from '@/hooks/use-trade-logs'
import { cn } from '@/lib/utils'
import { Routes } from '@/routes'

export const TradeLogs = () => {
  const { t } = useTranslation()
  const { isLatest, lastTrade, lastCreate } = useTradeLogs()

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'px-3 py-1.5 border rounded flex items-center gap-1',
          isLatest && 'animate-flash'
        )}
      >
        <Link
          href={`${Routes.Account}/address`}
          className="hover:underline hover:text-blue-600"
        >
          L1en
        </Link>
        <span>{t('bought').toLowerCase()}</span>
        <Link
          href={`${Routes.Token}/address`}
          className="hover:underline hover:text-blue-600"
        >
          BNB
        </Link>
      </div>
      <div className="px-3 py-1.5 border rounded">L1en created $PEOPLE</div>
    </div>
  )
}

export default TradeLogs
