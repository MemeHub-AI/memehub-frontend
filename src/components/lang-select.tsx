import React, { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { LuLanguages } from 'react-icons/lu'
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

export const LangSelect = ({ className }: ComponentProps<'div'>) => {
  const { t, i18n } = useTranslation()
  const { setLang } = useLang()

  return (
    <>
      <div className={cn('max-lg:hidden', className)}>
        <HoverCard openDelay={100}>
          <HoverCardTrigger className="p-0">
            <Button size="icon" className={cn(className)}>
              <LuLanguages size={20} />
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
                {i18n.language === code && <FaCheck className="ml-5" />}
              </Button>
            ))}
          </HoverCardContent>
        </HoverCard>
      </div>

      <div className={cn('lg:hidden', className)}>
        <Accordion defaultValue={['item-1']} type="multiple">
          <AccordionItem value="item-1">
            <AccordionTrigger className="pt-0">
              <div className="flex items-center text-base space-x-4">
                <LuLanguages size={20} />
                <span>{t('Languages')}</span>
              </div>
            </AccordionTrigger>
            {langs.map(([code, { name }], i) => (
              <AccordionContent
                key={i}
                onClick={() => setLang(code)}
                className="pl-5"
              >
                <span
                  className={cn(
                    i18n.language === code && 'text-blue-500 font-bold'
                  )}
                >
                  {name}
                </span>
              </AccordionContent>
            ))}
          </AccordionItem>
        </Accordion>
      </div>
    </>
  )
}

export default LangSelect
