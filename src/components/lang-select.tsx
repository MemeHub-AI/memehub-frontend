import React, { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { resources } from '@/i18n'
import { useLang } from '@/hooks/use-lang'
import { cn } from '@/lib/utils'

const langs = Object.entries(resources as Record<string, { name: string }>)

export const LangSelect = (props: ComponentProps<'div'>) => {
  const { className } = props
  const { t, i18n } = useTranslation()
  const { setLang } = useLang()

  return (
    <Select value={i18n.language} onValueChange={setLang}>
      <SelectTrigger className={cn('w-24', className)}>
        <SelectValue placeholder={t('lang')} />
      </SelectTrigger>
      <SelectContent>
        {langs.map(([code, { name }], i) => (
          <SelectItem value={code} key={i}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default LangSelect
