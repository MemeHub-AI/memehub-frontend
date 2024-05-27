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

  return (
    <>
      <h3 className={cn('font-bold mb-1', className)}>{t('holders')}</h3>
      <div className="text-sm text-zinc-500">
        <CustomSuspense
          container="ul"
          className="flex flex-col gap-1"
          isPending={!holders}
          fallback={<HolderRankSkeleton />}
        >
          {holders?.map((r, i) => (
            <li key={i} className="flex items-center justify-between">
              <div className="hover:text-blue-600 transition-all cursor-pointer">
                {i + 1}.{' '}
                <Link href={r.scan_url} target="_blank">
                  {fmt.addr(r.address)}
                </Link>
                {/* {r.isBondingCurve && ` 💰 (${t('bonding-curve')})`} */}
                {/* {r.isDev && ` 🧑‍💻 (${t('dev')})`} */}
              </div>
              <span>{fmt.percent(r.percentage)}</span>
            </li>
          ))}
        </CustomSuspense>
      </div>
    </>
  )
}

const HolderRankSkeleton = () => {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between">
          <Skeleton className="w-32 h-4" />
          <Skeleton className="w-8 h-4" />
        </div>
      ))}
    </div>
  )
}

export default HoldersRank
