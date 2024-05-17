import React, { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { GlobeIcon } from '@radix-ui/react-icons'

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
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const langs = Object.entries(resources as Record<string, { name: string }>)

export const LangSelect = (props: ComponentProps<'div'>) => {
  const { className } = props
  const { t, i18n } = useTranslation()
  const { setLang } = useLang()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={cn('ml-3', className)}>
          <GlobeIcon width={22} height={22} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {langs.map(([code, { name }], i) => (
          <DropdownMenuCheckboxItem
            checked={i18n.language === code}
            textValue={code}
            key={i}
            onClick={() => setLang(code)}
          >
            {name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )

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
