import React from 'react'
import { useTranslation } from 'react-i18next'

import type { TokenListItem } from '@/api/token/types'

import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { useAccountContext } from '@/contexts/account'
import { CustomSuspense } from '@/components/custom-suspense'
import { Skeleton } from '@/components/ui/skeleton'

export const TokenHeldCards = () => {
  const { t } = useTranslation()
  const { userInfo, isPending } = useAccountContext()

  return (
    <CustomSuspense
      isPending={isPending}
      fallback={<CardSkeleton />}
      nullback={<p className="text-zinc-500">{t('token.no-token')}</p>}
      className="grid grid-cols-3 gap-3 xl:grid-cols-4 max-sm:grid-cols-1 max-sm:gap-2"
    >
      {userInfo?.coins_held?.map((c, i) => (
        <HeldCard c={c} key={i} />
      ))}
    </CustomSuspense>
  )
}

const HeldCard = ({ c }: { c: TokenListItem }) => {
  return (
    <Card padding="md" hover="bg">
      <div className="flex items-center gap-2">
        <Avatar src={c.image} fallback={c.name.slice(-4)} />
        <div className="flex flex-col justify-between">
          <p className="font-bold">
            {c.name}({c.ticker})
          </p>
          <p className="text-zinc-500 text-sm">{c.desc}</p>
        </div>
      </div>
    </Card>
  )
}

const CardSkeleton = () => {
  return (
    <div className="grid grid-cols-3 gap-3 xl:grid-cols-4 max-sm:grid-cols-1 max-sm:gap-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card className="flex gap-2" padding="md" key={i}>
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex flex-col justify-between">
            <Skeleton className="w-20 h-4" />
            <Skeleton className="w-14 h-3 rounded-full" />
          </div>
        </Card>
      ))}
    </div>
  )
}

export default TokenHeldCards
