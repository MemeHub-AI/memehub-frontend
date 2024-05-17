import React, { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

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

export const TokenCards = ({ className }: ComponentProps<'div'>) => {
  const { t } = useTranslation()
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
  const chains = [
    {
      id: 1,
      name: 'Scroll',
    },
  ]
  const cards = [
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      description:
        'btc descriptionbtc descriptionbtc descriptionbtc descriptionbtc descriptionbtc descriptionbtc descriptionbtc descriptionbtc descriptionbtc description',
      creator: 'L1en',
      marketCap: 12312321,
      commentCount: 123123891,
      address: 'So11111111111111111111111111111111111111112',
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      description: 'eth description',
      creator: 'Linken',
      marketCap: 222111,
      commentCount: 3413132,
      address: 'So11111111111111111111111111111111111111112',
    },
    {
      name: 'Solana',
      symbol: 'SOL',
      description: 'sol description',
      creator: 'Linksol',
      marketCap: 312234,
      commentCount: 2332,
      address: 'So11111111111111111111111111111111111111112',
    },
  ]

  const onChange = (idx: string) => {
    const item = sortItems[Number(idx)]
    console.log('item', item)
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <Select onValueChange={onChange}>
          <SelectTrigger className="mb-4 w-[inheirt] max-sm:mb-2">
            <SelectValue placeholder={t('chain')} />
          </SelectTrigger>
          <SelectContent>
            {chains.map((c, i) => (
              <SelectItem key={i} value={String(i)}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select defaultValue={String(0)} onValueChange={onChange}>
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
        </Select>
      </div>
      <div
        className={cn(
          'grid grid-cols-2 gap-4 xl:grid-cols-3 max-sm:grid-cols-1',
          'max-sm:gap-2',
          className
        )}
      >
        {cards.map((c, i) => (
          <TokenCard key={i} card={c} />
        ))}
      </div>
    </>
  )
}

export default TokenCards
