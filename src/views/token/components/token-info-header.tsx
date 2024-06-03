import { type ComponentProps } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { BigNumber } from 'bignumber.js'

import { useTokenContext } from '@/contexts/token'
import { Routes } from '@/routes'
import { fmt } from '@/utils/fmt'
import { useHoldersStore } from '@/stores/use-holders-store'
import { cn } from '@/lib/utils'

export const TokenInfoHeader = ({ className }: ComponentProps<'div'>) => {
  const router = useRouter()
  const { t } = useTranslation()
  const { tokenInfo } = useTokenContext()
  const { marketCap } = useHoldersStore()

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 px-1 text-sm',
        className
      )}
    >
      <span className="flex items-center gap-4">
        {t('market-cap')}: ${fmt.tradeFixed(BigNumber(marketCap))}
        {/* <p>{t('virtual-liquidity')}: ${virtualLiquidity}</p> */}
      </span>
      <div className="flex items-center gap-1">
        <div className="mr-1">{t('creator')}:</div>
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
