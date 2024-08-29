import { useEffect, useState, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { isEmpty } from 'lodash'

import { cn } from '@/lib/utils'
import { TokenCard } from './token-card'
import { Skeleton } from '../ui/skeleton'
import { CustomSuspense } from '../custom-suspense'
import { Routes } from '@/routes'
import { TokenChainSelect } from './token-chain-select'
import { TokenSearchInput } from '../token/search-input'
import { useIsPlayAudio } from '@/stores/use-is-play-audio'
import { useAudioPlayer } from '@/hooks/use-audio-player'
import { TokenListItem } from '@/api/token/types'
import { IdoCard } from '../ido-card'
import { LoadMore } from '../load-more'
import { useTokensPools } from '@/hooks/token/use-tokens-pools'
import { Switch } from '../ui/switch'
import { Label } from '../ui/label'
import { useLocalStorage } from '@/hooks/use-storage'
import { strToBool } from '@/utils'

interface Props extends ComponentProps<'div'> {
  cards?: TokenListItem[]
  idoTokens?: TokenListItem[]
  total: number
  isLoading: boolean
  isPending?: boolean
  onFetchNext?: () => void
  showSearch?: boolean
}

export const TokenCards = ({
  className,
  cards = [],
  idoTokens = [],
  total,
  isLoading,
  isPending = false,
  showSearch = true,
  onFetchNext,
}: Props) => {
  const { t } = useTranslation()
  const [chianTag, setChainTag] = useState('all')
  const [filteredTokens, setFilteredTokens] = useState(cards)
  const { getStorage, setStorage } = useLocalStorage()
  const [checked, setChecked] = useState(
    strToBool(getStorage('only_graduated_checked'))
  )

  const { isPlayHomeAudio, setIsPlayHomeAudio } = useIsPlayAudio()
  const { playHome } = useAudioPlayer()
  const { pools, isLoadingPools } = useTokensPools(cards)

  const onChange = (chain: string) => {
    setChainTag(chain)

    if (chain === 'all') {
      setFilteredTokens(cards)
      return
    }

    setFilteredTokens(cards.filter((c) => c.chain === chain))
  }

  useEffect(() => {
    if (isPlayHomeAudio) {
      playHome()
      setIsPlayHomeAudio(false)
    }
  }, [])

  useEffect(() => {
    setFilteredTokens(cards)
  }, [cards])

  return (
    <div className={cn('mt-4', className)}>
      <CustomSuspense
        className="flex justify-between items-center max-sm:justify-between max-sm:gap-0 mb-4"
        isPending={isLoading}
        fallback={
          <>
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-40" />
          </>
        }
      >
        {/* <TokenChainSelect onValueChange={onChange} />
        <TokenSortSelect /> */}
        <Label className="inline-flex items-center space-x-2">
          <Switch
            checked={checked}
            onCheckedChange={(checked) => {
              setChecked(checked)
              setStorage('only_graduated_checked', checked.toString())
            }}
          />
          <span>{t('filter.only-graduated')}</span>
        </Label>
        {showSearch && (
          <TokenSearchInput
            showPopover={false}
            chianTag={chianTag}
            onSearched={(tokens) => setFilteredTokens(tokens)}
            onCleared={() => {
              if (chianTag !== 'all') {
                setFilteredTokens(cards.filter((c) => c.chain === chianTag))
              } else {
                setFilteredTokens(cards)
              }
            }}
          />
        )}
      </CustomSuspense>

      <CustomSuspense
        className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3 max-sm:gap-3"
        isPending={isLoading || isLoadingPools}
        fallback={<CardSkeleton />}
        nullback={
          <div className="text-zinc-500">
            {t('tokens.list.empty')},
            <Link className="text-blue-600 ml-2" href={Routes.Create}>
              {t('start-coin')}
            </Link>
            {t('period')}
          </div>
        }
      >
        {idoTokens.map((t) => (
          <IdoCard key={t.id} token={t} />
        ))}
        {!isEmpty(cards) &&
          filteredTokens.map((t, i) => (
            <TokenCard
              key={i}
              card={t}
              pool={pools[i]}
              onlyGraduated={checked}
            />
          ))}
      </CustomSuspense>

      <LoadMore
        className="mt-2"
        list={filteredTokens}
        total={total}
        isLoading={isPending}
        onFetchMore={onFetchNext}
      />
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
