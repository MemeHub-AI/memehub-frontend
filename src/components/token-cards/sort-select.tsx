import React, { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Order } from '@/utils/types'

export const TokenSortSelect = (props: ComponentProps<typeof Select>) => {
  const { onValueChange, ...restProps } = props
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

  return (
    <Select
      defaultValue={String(0)}
      onValueChange={onValueChange}
      {...restProps}
    >
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
  )
}

export default TokenSortSelect
