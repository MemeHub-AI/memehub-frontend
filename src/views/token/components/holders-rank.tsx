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

  const isBc = (str: string) => {
    return str.toLowerCase().includes('bonding')
  }

  const isCreator = (str: string) => {
    str = str.toLowerCase()
    return str.includes('dev') || str.includes('cretor')
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
                {isBc(r.contract_flag ?? '') && `💰(${t('bonding-curve')})`}
                {isCreator(r.contract_flag ?? '') && `🧑‍💻(${t('creator')})`}
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
