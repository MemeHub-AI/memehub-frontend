import React, { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { Languages } from 'lucide-react'
import { FaCheck } from 'react-icons/fa6'

import { resources } from '@/i18n'
import { useLang } from '@/hooks/use-lang'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card'

const langs = Object.entries(resources as Record<string, { name: string }>)

export const LangSelect = (props: ComponentProps<'div'>) => {
  const { className } = props
  const { i18n } = useTranslation()
  const { setLang } = useLang()

  return (
    <HoverCard openDelay={100}>
      <HoverCardTrigger className="p-0">
        <Button size="icon" className={cn(className)}>
          <Languages size={20} />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-fit py-[6px] px-1 mt-1">
        {langs.map(([code, { name }], i) => (
          <div
            key={i}
            onClick={() => setLang(code)}
            className={cn(
              'flex justify-between items-center leading-8 cursor-pointer',
              'px-3 rounded hover:bg-black hover:text-white'
            )}
          >
            {name}
            {i18n.language === code ? <FaCheck className="ml-5" /> : null}
          </div>
        ))}
      </HoverCardContent>
    </HoverCard>
  )
}

export default LangSelect
