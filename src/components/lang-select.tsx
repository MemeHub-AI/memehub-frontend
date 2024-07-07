import React, { ComponentProps } from 'react'
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
} from "@/components/ui/accordion"

const langs = Object.entries(resources as Record<string, { name: string }>)

export const LangSelect = (props: ComponentProps<'div'>) => {
  const { className } = props
  const { i18n } = useTranslation()
  const { getLang, setLang } = useLang()
  const { t } = useTranslation()
  const currentLang = getLang()
  return (
    <div>
      <div className='max-lg:hidden'>
        <HoverCard openDelay={100}>
          <HoverCardTrigger className="p-0">
            <Button size="icon" className={cn(className)}>
              <Languages size={20} />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-min py-[6px] px-1 mt-1">
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
        <Accordion type="single" collapsible >
          <AccordionItem value="item-1">
            <AccordionTrigger>{t('Languages')}</AccordionTrigger>
            <AccordionContent onClick={() => setLang('zh')}>
              <span className={currentLang === 'zh' ? 'text-blue-500': ""}>{t('中文')}</span>
            </AccordionContent>
            <AccordionContent onClick={() => setLang('en')}>
              <span className={currentLang === 'en' ? 'text-blue-500': ""}>{t('English')}</span>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}



export default LangSelect
