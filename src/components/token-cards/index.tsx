import React, { useEffect, useState, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { TokenCard } from './card'
import { Skeleton } from '../ui/skeleton'
import { CustomSuspense } from '../custom-suspense'
import { useScrollLoad } from '@/hooks/use-scroll-load'
import { Routes } from '@/routes'
import { UserCoinsCreated } from '@/api/user/types'
import { TokenChainSelect } from './chain-select'

interface Props extends ComponentProps<'div'> {
  cards?: UserCoinsCreated[]
  total: number
  isLoading: boolean
  isPending?: boolean
  onFetchNext?: () => void
}

export const TokenCards = (props: Props) => {
  const {
    className,
    cards = [],
    total,
    isLoading,
    isPending = false,
    onFetchNext,
  } = props
  const { t } = useTranslation()
  const [filteredCards, setFilteredCards] = useState(cards)

  // TODO: Encapsulate a component to handling scroll load.
  const { noMore } = useScrollLoad({
    onFetchNext,
    hasMore: cards.length < total,
  })

  const onChange = (chainId: string) => {
    if (chainId === 'all') {
      setFilteredCards(cards)
      return
    }

    setFilteredCards(cards.filter((c) => c.chain.id === chainId))
  }

  useEffect(() => {
    setFilteredCards(cards)
  }, [cards])

  return (
    <div className={cn(className)}>
      {isLoading ? (
        <Skeleton className="h-9 w-24 mb-4" />
      ) : (
        <div
          className={cn(
            'flex items-center gap-4 max-sm:justify-between mb-4',
            total <= 1 && 'hidden'
          )}
        >
          <TokenChainSelect onValueChange={onChange} />
          {/* <TokenSortSelect /> */}
        </div>
      )}

      <CustomSuspense
        className={cn(
          'grid grid-cols-2 gap-4 2xl:grid-cols-3 max-sm:grid-cols-1',
          'max-sm:gap-2'
        )}
        isPending={isLoading}
        fallback={<CardSkeleton />}
        nullback={
          <div className="text-zinc-500">
            {t('tokens.list.empty')},
            <Link className="text-blue-600 ml-2" href={Routes.Create}>
              {t('token.create')}
            </Link>
            {t('period')}
          </div>
        }
      >
        {cards.length ? (
          <>
            {filteredCards.map((t, i) => (
              <TokenCard key={i} card={t} />
            ))}
          </>
        ) : null}
        {isPending && (
          <p className="text-center text-zinc-500 col-span-2 2xl:col-span-3">
            {t('loading')}
          </p>
        )}
        {noMore && (
          <p className="text-center text-zinc-500 col-span-2 2xl:col-span-3">
            {t('nomore')}
          </p>
        )}
      </CustomSuspense>
    </div>
  )
}

const CardSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-4 2xl:grid-cols-3 max-sm:grid-cols-1 max-sm:gap-2 ">
      {Array.from({ length: 4 }).map((_, i) => (
        <div className="border-2 rounded flex gap-2 relative" key={i}>
          <Skeleton className="w-40 h-40 flex-shrink-0 rounded-none" />
          <div className="w-full my-2 flex flex-col justify-between gap-2 mr-2">
            <div className="flex flex-col gap-2">
              <Skeleton className="w-1/2 h-6 mt-1" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-1/2 h-4" />
            </div>
            <Skeleton className="w-full h-5 rounded-full" />
          </div>
          <Skeleton className="w-6 h-6 rounded-full absolute right-2 top-2" />
        </div>
      ))}
    </div>
  )
}

export default TokenCards
