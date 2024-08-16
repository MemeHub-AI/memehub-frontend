import React, { type ComponentProps } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { zeroAddress } from 'viem'
import { BigNumber } from 'bignumber.js'

import { fmt } from '@/utils/fmt'
import { cn } from '@/lib/utils'
import { CustomSuspense } from '@/components/custom-suspense'
import { Skeleton } from '@/components/ui/skeleton'
import { useTokenContext } from '@/contexts/token'
import { useChainsStore } from '@/stores/use-chains-store'

enum Flag {
  Bc = 'Bonding Curve',
  Airdrop = 'Airdrop',
  Black = 'Black Hole',
}

export const HoldersRank = ({ className }: ComponentProps<'div'>) => {
  const { t } = useTranslation()
  const { chainsMap } = useChainsStore()
  const { isIdoToken, holders, tokenInfo } = useTokenContext()
  const { total_supply } = tokenInfo ?? {}

  const getLabel = ({ flag, holder = '' }: (typeof holders)[number]) => {
    const f = flag || ''

    // Zero addr.
    if (holder === zeroAddress) {
      return `🔥${t('holder.burning')}`
    }

    // Bonding curve.
    if (f === Flag.Bc) return `(💰${t('pool')})`

    // Creator or dev.
    if (f.includes('dev') || f.includes('creator')) {
      return `(🧑‍💻${t('creator')})`
    }

    // Dex.
    if (f.includes('dex')) {
      return `(👑${t('dex')})`
    }

    // Airdrop.
    if (f === Flag.Airdrop) {
      return `(${t('airdrop')})`
    }
  }

  const getPercent = (amount: string) => {
    if (!total_supply) return 0
    return BigNumber(amount).div(total_supply).toFixed()
  }

  if (isIdoToken) return

  return (
    <>
      <h3 className={cn('font-bold my-2 max-sm:text-lg', className)}>
        {t('holders')}
      </h3>
      <div className="text-sm text-zinc-500">
        <CustomSuspense
          container="ul"
          className="flex flex-col gap-1"
          isPending={!holders}
          fallback={<HolderRankSkeleton />}
          nullback={<p>{t('no.holders')}</p>}
        >
          {holders?.map((r, i) => {
            // Exclude airdrop.
            if (r.flag?.includes('Air')) return null
            return (
              <li key={i} className="flex items-center justify-between">
                <p>
                  {i + 1}.{' '}
                  <Link
                    href={`${chainsMap[r.chain]?.explorer}/address/${r.holder}`}
                    target="_blank"
                    className="hover:text-black hover:underline transition-all cursor-pointer"
                  >
                    {fmt.addr(r.holder)}
                  </Link>
                  {getLabel(r)}
                </p>
                <span>{fmt.percent(getPercent(r.amount))}</span>
              </li>
            )
          })}
        </CustomSuspense>
      </div>
    </>
  )
}

const HolderRankSkeleton = () => {
  return Array.from({ length: 5 }).map((_, i) => (
    <div key={i} className="flex items-center justify-between">
      <Skeleton className="w-32 h-4" />
      <Skeleton className="w-8 h-4" />
    </div>
  ))
}

export default HoldersRank
