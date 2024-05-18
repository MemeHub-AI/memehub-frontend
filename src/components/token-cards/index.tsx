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
import { useTokens } from '@/hooks/use-tokens'

const chains = [
  {
    id: 1,
    name: 'Scroll',
  },
  {
    id: 1,
    name: 'Ethereum',
    disabled: true,
  },
]

export const TokenCards = ({ className }: ComponentProps<'div'>) => {
  const { t } = useTranslation()
  const { tokens } = useTokens()
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

  const onChange = (idx: string) => {
    const item = sortItems[Number(idx)]
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
        {tokens.map((t, i) => (
          <TokenCard key={i} card={t} />
        ))}
      </div>
    </>
  )
}

export default TokenCards
