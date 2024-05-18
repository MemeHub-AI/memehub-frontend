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
    {
      id: 1,
      name: 'BSC',
      disabled: true,
    },
    {
      id: 1,
      name: 'Base',
      disabled: true,
    },
  ]
  const cards = [
    {
      name: 'MemeHub',
      symbol: 'MHUB',
      description: 'description...',
      creator: 'L1en',
      marketCap: 12312321,
      commentCount: 123123891,
      address: '0x5300000000000000000000000000000000000004',
    },
  ]

  const onChange = (idx: string) => {
    const item = sortItems[Number(idx)]
    console.log('item', item)
  }

  return (
    <>
      <div className="flex items-center gap-4 max-sm:justify-between">
        <Select onValueChange={onChange}>
          <SelectTrigger className="mb-4 w-[inheirt] max-sm:mb-2">
            <SelectValue placeholder={t('chains')} />
          </SelectTrigger>
          <SelectContent>
            {chains.map((c, i) => (
              <SelectItem key={i} value={String(i)} disabled={c.disabled}>
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
