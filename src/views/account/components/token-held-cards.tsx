import React from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

import type { UserCoinsHeld } from '@/api/user/types'
import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { CustomSuspense } from '@/components/custom-suspense'
import { Skeleton } from '@/components/ui/skeleton'
import { Routes } from '@/routes'
import { useScrollLoad } from '@/hooks/use-scroll-load'
import { fmt } from '@/utils/fmt'
import { joinPaths } from '@/utils'

interface Props {
  cards: UserCoinsHeld[]
  total: number
  isLoading: boolean
  isPending?: boolean
  onFetchNext?: () => void
}

export const TokenHeldCards = (props: Props) => {
  const { cards, total, isLoading, isPending, onFetchNext } = props
  const { t } = useTranslation()
  const { noMore } = useScrollLoad({
    hasMore: total > cards.length,
    onFetchNext,
  })

  return (
    <CustomSuspense
      isPending={isLoading}
      fallback={<CardSkeleton />}
      nullback={<p className="text-zinc-500">{t('token.no-token')}</p>}
      className="grid grid-cols-3 gap-3 2xl:grid-cols-4 max-sm:grid-cols-1 max-sm:gap-0"
    >
      {cards?.map((c, i) => (
        <HeldCard c={c} key={i} />
      ))}
      <div className="max-sm:mt-2">
        {isPending && (
          <div className="text-zinc-500 text-center col-span-3">
            {t('loading')}
          </div>
        )}
        {noMore && (
          <div className="text-zinc-500 text-center col-span-3">
            {t('nomore')}
          </div>
        )}
      </div>
    </CustomSuspense>
  )
}

const HeldCard = ({ c }: { c: UserCoinsHeld }) => {
  const router = useRouter()

  return (
    <Card
      padding="md"
      hover="bg"
      onClick={() =>
        router.push(joinPaths(Routes.Main, c.chain, c.contract_address))
      }
      className="max-sm:mb-2"
    >
      <div className="flex items-center">
        <Avatar src={c.image_url} fallback={c.symbol[0]} />
        <div className="flex flex-col justify-between ml-2">
          <p className="font-bold break-all line-clamp-1">
            {c.name}({c.symbol})
          </p>
          <p className="text-zinc-500 text-sm">
            {fmt.decimals(c.hold_amount)} {c.symbol}
          </p>
        </div>
      </div>
    </Card>
  )
}

const CardSkeleton = () => {
  return Array.from({ length: 3 }).map((_, i) => (
    <Card className="flex mb-2" padding="md" key={i}>
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex flex-col justify-between ml-2">
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-14 h-3 rounded-full" />
      </div>
    </Card>
  ))
}

export default TokenHeldCards
