import React, { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useChainsStore } from '@/stores/use-chains-store'

export const TokenChainSelect = (props: ComponentProps<typeof Select>) => {
  const { onValueChange, ...restProps } = props
  const { t } = useTranslation()
  const { chains } = useChainsStore()

  return (
    <Select onValueChange={onValueChange} {...restProps}>
      <SelectTrigger className="w-26">
        <SelectValue placeholder={t('chains')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t('all')}</SelectItem>
        {chains.map((c, i) => (
          <SelectItem key={i} value={c.name}>
            {c.displayName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default TokenChainSelect
