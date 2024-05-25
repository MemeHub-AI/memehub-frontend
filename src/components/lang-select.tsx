import React, { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { Languages } from 'lucide-react'

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
import { FaCheck } from 'react-icons/fa6'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card'

const langs = Object.entries(resources as Record<string, { name: string }>)

export const LangSelect = (props: ComponentProps<'div'>) => {
  const { className } = props
  const { t, i18n } = useTranslation()
  const { setLang } = useLang()

  return (
    <HoverCard openDelay={0} closeDelay={100}>
      <HoverCardTrigger className="p-0">
        <Button variant="ghost" size="icon" isShadow className={cn(className)}>
          <Languages size={20} />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-min py-[6px]">
        {langs.map(([code, { name }], i) => (
          <div
            key={i}
            onClick={() => setLang(code)}
            className="flex justify-between items-center w-[90px] leading-8 cursor-pointer"
          >
            {name}
            {i18n.language === code ? <FaCheck className="ml-5" /> : null}
          </div>
        ))}
      </HoverCardContent>
    </HoverCard>
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
