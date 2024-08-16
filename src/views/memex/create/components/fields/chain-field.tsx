import React from 'react'
import { useTranslation } from 'react-i18next'

import { FormField, FormControl } from '@/components/ui/form'
import { ChainSelect } from '@/components/chain-select'
import { useCreateIdeaContext } from '@/contexts/memex/create-idea'
import { cn } from '@/lib/utils'

export const CreateIdeaChainField = () => {
  const { t } = useTranslation()
  const { form, isCreating } = useCreateIdeaContext()

  return (
    <FormField
      control={form.control}
      name="chain"
      render={({ field }) => (
        <div>
          <p
            className={cn(
              'text-sm font-semibold',
              (isCreating || field.disabled) && 'opacity-50'
            )}
          >
            {t('chain')}
          </p>
          <FormControl>
            <ChainSelect
              {...field}
              disabled={isCreating || field.disabled}
              onChange={(c) => field.onChange(c.name)}
            />
          </FormControl>
        </div>
      )}
    />
  )
}

export default CreateIdeaChainField
