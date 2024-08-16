import React from 'react'
import { FaArrowDown } from 'react-icons/fa6'
import { useTranslation } from 'react-i18next'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { useCreateIdeaDetailsContext } from '@/contexts/memex/create-idea-detail'
import { FormField, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useMemexStore } from '@/stores/use-memex'

export const OptionalFields = () => {
  const { t } = useTranslation()
  const { form, isUpdating } = useCreateIdeaDetailsContext()
  const { ideaDetails: postDetails } = useMemexStore()
  const { twitter_url, telegram_url, website_url } = postDetails ?? {}
  const defaultOpen = !!twitter_url || !!telegram_url || !!website_url

  return (
    <Collapsible defaultOpen={defaultOpen} className="mt-2 mb-3 group">
      <CollapsibleTrigger className="flex items-center text-blue-600 font-bold space-x-1">
        <span>{t('meemx.crate-detail.optional-title')}</span>
        <FaArrowDown className="group-data-[state=open]:rotate-180 duration-150" />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2">
        <FormField
          control={form.control}
          name="x"
          render={({ field }) => (
            <div>
              <FormLabel className="font-bold">{t('twitter-link')}</FormLabel>
              <Input
                placeholder={`(${t('optional')})`}
                className="px-2"
                {...field}
                disabled={field.disabled || isUpdating}
              />
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="tg"
          render={({ field }) => (
            <div>
              <FormLabel className="font-bold">{t('telegram-link')}</FormLabel>
              <Input
                placeholder={`(${t('optional')})`}
                className="px-2"
                {...field}
                disabled={field.disabled || isUpdating}
              />
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <div>
              <FormLabel className="font-bold">{t('website')}</FormLabel>
              <Input
                placeholder={`(${t('optional')})`}
                className="px-2"
                {...field}
                disabled={field.disabled || isUpdating}
              />
            </div>
          )}
        />
      </CollapsibleContent>
    </Collapsible>
  )
}

export default OptionalFields
