import React, { ComponentProps, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Languages } from 'lucide-react'
import { FaCheck } from 'react-icons/fa6'

import { resources } from '@/i18n'
import { useLang } from '@/hooks/use-lang'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const langs = Object.entries(resources as Record<string, { name: string }>)

export const LangSelect = (props: ComponentProps<'div'>) => {
  const { className } = props
  const { i18n } = useTranslation()
  const { setLang } = useLang()
  const { t } = useTranslation()

  return (
    <div>
      <div className="max-lg:hidden">
        <HoverCard openDelay={100}>
          <HoverCardTrigger className="p-0">
            <Button size="icon" className={cn(className)}>
              <Languages size={20} />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent
            className="w-min py-[6px] px-1 mt-1 relative !left-1"
            sideOffset={8}
          >
            {langs.map(([code, { name }], i) => (
              <Button
                key={i}
                onClick={() => setLang(code)}
                variant="ghost"
                shadow="none"
                className="w-full justify-start"
              >
                {name}
                {i18n.language === code ? <FaCheck className="ml-5" /> : null}
              </Button>
            ))}
          </HoverCardContent>
        </HoverCard>
      </div>
      <div className={cn('lg:hidden', className)}>
        <Accordion defaultValue={['item-1']} type="multiple">
          <AccordionItem value="item-1">
            <AccordionTrigger>{t('Languages')}</AccordionTrigger>
            {
              langs.map(([code, { name }], i) => (
                <AccordionContent key={i} onClick={() => setLang(code)}>
                  <span className={i18n.language === code ? 'text-blue-500' : ''}>{name}</span>
                </AccordionContent>
              ))
            }
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}

export default LangSelect
