import { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import { useTokenContext } from '@/contexts/token'
import { fmt } from '@/utils/fmt'
import { useHoldersStore } from '@/stores/use-holders-store'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { BondingCurveProgress } from './bonding-curve-progress'
import { Avatar } from '@/components/ui/avatar'

export const TokenInfoHeader = ({ className }: ComponentProps<'div'>) => {
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
        'flex items-center justify-between gap-1 text-sm mb-1 max-sm:mt-4',
        className
      )}
    >
      <Avatar
        src={tokenInfo?.image ?? ''}
        size={26}
        className="border-2 border-black"
      />
      <div className="flex items-center gap-3 ">
        <span className="font-bold text-blue-600">
          {tokenInfo?.name}({tokenInfo?.ticker})
        </span>
        <span>
          <span className="font-bold">{t('market-cap')}: </span>$
          {fmt.decimals(marketCap)}
        </span>
      </div>

      <BondingCurveProgress className="ml-2" showDesc={false} />

      {/* Creator */}
      {/* <div className="flex items-center gap-1">
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
      </div> */}
    </div>
  )
}

export default TokenInfoHeader
