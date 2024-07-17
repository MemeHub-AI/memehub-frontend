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
import { TokenSearchInput } from './token-search-input'
import useAudioPlayer from '@/hooks/use-audio-player'
import { useIsPlayAudio } from '@/stores/use-is-play-audio'

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
  const [chianTag, setChainTag] = useState('all')
  const [filteredCards, setFilteredCards] = useState(cards)
  const { isPlayHomeAudio, setIsPlayHomeAudio } = useIsPlayAudio()
  const { noMore } = useScrollLoad({
    onFetchNext,
    hasMore: cards.length < total,
  })

  const onChange = (chainId: string) => {
    setChainTag(chainId)

    if (chainId === 'all') {
      setFilteredCards(cards)
      return
    }

    setFilteredCards(cards.filter((c) => c.chain.id === chainId))
  }

  useEffect(() => {
    setFilteredCards(cards)
  }, [cards])

  useEffect(() => {
    setFilteredCards(cards)
  }, [cards])

  return (
    <div className={cn(className)}>
      <audio
        autoPlay={isPlayHomeAudio}
        onPlay={() => setIsPlayHomeAudio(false)}
      >
        <source src="/audio/home.mp3" type="audio/mpeg" />
      </audio>
      <CustomSuspense
        className="flex justify-between items-start gap-4 max-sm:justify-between mb-4 max-sm:gap-0"
        isPending={isLoading}
        fallback={
          <>
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-40" />
          </>
        }
      >
        <TokenChainSelect onValueChange={onChange} />
        {/* <TokenSortSelect /> */}
        <TokenSearchInput
          chianTag={chianTag}
          onSearched={(tokens) => setFilteredCards(tokens)}
          onCleared={() =>
            setFilteredCards(cards.filter((c) => c.chain.id === chianTag))
          }
          className="ml-4"
        />
      </CustomSuspense>

      <CustomSuspense
        className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3 max-sm:gap-3"
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
        {/* <IdoCard /> */}
        <TokenCard card={filteredCards?.[0]} isIdo />
        {!!cards.length &&
          filteredCards.map((t, i) => <TokenCard key={i} card={t} />)}
      </CustomSuspense>
      <div className="mt-2">
        {isPending && (
          <div className="text-center text-zinc-500 col-span-2 2xl:col-span-3">
            {t('loading')}
          </div>
        )}
        {noMore && (
          <div className="text-center text-zinc-500 col-span-2 2xl:col-span-3">
            {t('nomore')}
          </div>
        )}
      </div>
    </div>
  )
}

const CardSkeleton = () => {
  return Array.from({ length: 4 }).map((_, i) => (
    <div className="border-2 rounded flex relative mb-2" key={i}>
      <Skeleton className="w-40 h-40 flex-shrink-0 rounded-none" />
      <div className="w-full my-2 flex flex-col justify-between ml-2 mr-2">
        <div className="flex flex-col">
          <Skeleton className="w-1/2 h-6 mt-1" />
          <Skeleton className="w-full h-4 mt-2" />
          <Skeleton className="w-full h-4 mt-2" />
          <Skeleton className="w-1/2 h-4 mt-2" />
        </div>
        <Skeleton className="w-full h-5 rounded-full ml-2" />
      </div>
      <Skeleton className="w-6 h-6 rounded-full absolute right-2 top-2" />
    </div>
  ))
}

export default TokenCards
