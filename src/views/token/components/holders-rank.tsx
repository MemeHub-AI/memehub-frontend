import React, { type ComponentProps } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import { fmt } from '@/utils/fmt'
import { cn } from '@/lib/utils'
import { useHolders } from '../hooks/use-holders'
import { CustomSuspense } from '@/components/custom-suspense'
import { Skeleton } from '@/components/ui/skeleton'

export const HoldersRank = ({ className }: ComponentProps<'div'>) => {
  const { t } = useTranslation()
  const { holders } = useHolders()

  const getLabel = (flag: string) => {
    flag = flag.toLowerCase()

    // Bonding curve.
    if (flag.includes('bonding')) {
      return `(💰${t('bonding-curve')})`
    }

    // Creator or dev.
    if (flag.includes('dev') || flag.includes('creator')) {
      return `(🧑‍💻${t('creator')})`
    }

    // Dex.
    if (flag.includes('dex')) {
      return `(👑${t('dex')})`
    }

    // Airdrop.
    if (flag.includes('air')) {
      return `(${t('airdrop')})`
    }
  }

  return (
    <>
      <h3 className={cn('font-bold my-2', className)}>{t('holders')}</h3>
      <div className="text-sm text-zinc-500">
        <CustomSuspense
          container="ul"
          className="flex flex-col gap-1"
          isPending={!holders}
          fallback={<HolderRankSkeleton />}
          nullback={<p>{t('no.holders')}</p>}
        >
          {holders?.map((r, i) => (
            <li key={i} className="flex items-center justify-between">
              <p>
                {i + 1}.{' '}
                <Link
                  href={r.scan_url}
                  target="_blank"
                  className="hover:text-black hover:underline transition-all cursor-pointer"
                >
                  {fmt.addr(r.address)}
                </Link>
                {getLabel(r.contract_flag ?? '')}
              </p>
              <span>{fmt.percent(r.percentage)}</span>
            </li>
          ))}
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
