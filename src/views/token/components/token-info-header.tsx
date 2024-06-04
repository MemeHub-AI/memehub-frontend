import { type ComponentProps } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { BigNumber } from 'bignumber.js'

import { useTokenContext } from '@/contexts/token'
import { Routes } from '@/routes'
import { fmt } from '@/utils/fmt'
import { useHoldersStore } from '@/stores/use-holders-store'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

export const TokenInfoHeader = ({ className }: ComponentProps<'div'>) => {
  const router = useRouter()
  const { t } = useTranslation()
  const { tokenInfo, isLoadingTokenInfo } = useTokenContext()
  const { marketCap } = useHoldersStore()

  if (isLoadingTokenInfo) {
    return (
      <div className="flex items-center justify-between gap-4 px-1 text-sm mb-1">
        <Skeleton className="w-36 h-5" />
        <Skeleton className="w-28 h-5" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 px-1 text-sm mb-1',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span className="font-bold">
          {tokenInfo?.name}({tokenInfo?.ticker})
        </span>
        <span>
          <span className="font-bold">{t('market-cap')}: </span>$
          {fmt.tradeFixed(BigNumber(marketCap))}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <div className="mr-1 font-bold">{t('creator')}:</div>
        <img
          src={tokenInfo?.creator.logo || ''}
          className="h-5 w-5 rounded-md"
        />
        <span
          className="hover:underline cursor-pointer"
          onClick={() => {
            const href = fmt.toHref(
              Routes.Account,
              tokenInfo?.creator.wallet_address || ''
            )
            router.push(href)
          }}
        >
          {tokenInfo?.creator.name}
        </span>
      </div>
    </div>
  )
}

export default TokenInfoHeader
