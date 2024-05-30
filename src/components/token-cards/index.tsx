import React, { useEffect, useState, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import router from 'next/router'

import { cn } from '@/lib/utils'
import { TokenCard } from './card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Order } from '@/utils/types'
import { Skeleton } from '../ui/skeleton'
import { CustomSuspense } from '../custom-suspense'
import { useScrollLoad } from '@/hooks/use-scroll-load'
import { Routes } from '@/routes'
import { useWalletStore } from '@/stores/use-wallet-store'
import { useStorage } from '@/hooks/use-storage'
import { UserCoinsCreated } from '@/api/user/types'
import { Card, CardTitle } from '../ui/card'

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

  const { chains } = useWalletStore()
  const [filteredCards, setFilteredCards] = useState(cards)
  const { getChain, setChain } = useStorage()
  // TODO: Encapsulate a component to handling scroll load.
  const { noMore } = useScrollLoad({
    onFetchNext,
    hasMore: cards.length < total,
  })

  const sortItems = [
    {
      label: t('market.sort.asc'),
      order: Order.Asc,
    },
    {
      label: t('market.sort.desc'),
      order: Order.Desc,
    },
    {
      label: t('comments.sort.asc'),
      order: Order.Asc,
    },
    {
      label: t('comments.sort.desc'),
      order: Order.Desc,
    },
  ]

  const onChange = (chainId: string) => {
    if (chainId === 'all') {
      setFilteredCards(cards)
      return
    }

    setFilteredCards((cards) => cards.filter((c) => c.chain.id === chainId))
  }

  useEffect(() => {
    setFilteredCards(cards)
  }, [cards])

  return (
    <div className={cn(className)}>
      {total !== 0 && (
        <div className="flex items-center gap-4 max-sm:justify-between ">
          <Select onValueChange={onChange}>
            <SelectTrigger className="mb-4 w-26 max-sm:mb-2">
              <SelectValue placeholder={t('chains')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('all')}</SelectItem>
              {chains.map((c, i) => (
                <SelectItem key={i} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* <Select defaultValue={String(0)} onValueChange={onChange}>
          <SelectTrigger className="mb-4 w-[inheirt] max-sm:mb-2">
            <div>
              <span>{t('sort-by')}: </span>
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            {sortItems.map((s, i) => (
              <SelectItem key={i} value={String(i)}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select> */}
        </div>
      )}

      <CustomSuspense
        className={cn(
          'grid grid-cols-2 gap-4 xl:grid-cols-3 max-sm:grid-cols-1',
          'max-sm:gap-2 '
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
            <Card
              className={cn(
                'flex items-stretch rounded overflow-hidden gap-2 relative'
              )}
              onClick={() => router.push(`${Routes.Launchpad}/trump`)}
            >
              <img
                src={'https://storage.memehub.ai/memeai/txt2img-890848816.png'}
                alt="img"
                className="flex-shrink-0 h-40 w-40 object-cover"
                width={160}
                height={160}
              />
              <img
                src={'/images/bsc.svg'}
                alt="chain"
                className="absolute right-2 top-2 w-5"
              />
              <div className="py-2 pr-2 w-full flex flex-col justify-between">
                <div className="h-full">
                  <CardTitle className="pt-0 text-lg">Trump</CardTitle>
                  {/* <Link
            href={`${Routes.Account}/${card?.creator.wallet_address}`}
            className="text-zinc-500 text-xs mt-0.5 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {t('creator')}: {card?.creator.name}
          </Link> */}
                  <p className="text-zinc-500 text-sm break-all line-clamp-3">
                    Laugh out loud with TrumpLOL! A hilarious and entertaining
                    collection of Trump's most outrageous moments. Get ready to
                    burst into laughter and share the joy with friends. Let
                    TrumpLOL bring some humor into your life today!
                  </p>
                </div>
                <div>
                  <div className="w-max px-4 py-2 leading-none bg-red-500 text-white rounded-full">
                    Launchpad
                  </div>
                </div>
              </div>
            </Card>
            {filteredCards.map((t, i) => (
              <TokenCard key={i} card={t} />
            ))}
          </>
        ) : null}
        {isPending && (
          <p className="text-center text-zinc-500 col-span-2">{t('loading')}</p>
        )}
        {noMore && (
          <p className="text-center text-zinc-500 col-span-2">{t('nomore')}</p>
        )}
      </CustomSuspense>
    </div>
  )
}

const CardSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-3 max-sm:grid-cols-1 max-sm:gap-2 ">
      {Array.from({ length: 4 }).map((_, i) => (
        <div className="border rounded flex gap-2 relative" key={i}>
          <Skeleton className="w-32 h-32 flex-shrink-0" />
          <div className="w-full my-2 flex flex-col gap-2 mr-2">
            <Skeleton className="w-1/2 h-4" />
            <Skeleton className="w-1/3 h-3" />
            <Skeleton className="w-[70%] h-3" />
            <Skeleton className="w-1/2 h-3" />
            <Skeleton className="w-full h-5 rounded-full mt-2" />
          </div>
          <Skeleton className="w-8 h-8 absolute right-2 top-2" />
        </div>
      ))}
    </div>
  )
}

export default TokenCards
