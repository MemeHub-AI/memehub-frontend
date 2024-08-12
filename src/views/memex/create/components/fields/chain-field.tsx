import React from 'react'
import { useTranslation } from 'react-i18next'

import { FormField, FormControl } from '@/components/ui/form'
import { ChainSelect } from '@/components/chain-select'
import { useCreateTweetContext } from '@/contexts/memex/create-tweet'

export const CreateChainField = () => {
  const { t } = useTranslation()
  const { form } = useCreateTweetContext()

  return (
    <FormField
      control={form.control}
      name="chain"
      render={({ field }) => (
        <div>
          <p className="text-sm font-semibold">{t('chain')}</p>
          <FormControl>
            <ChainSelect {...field} onChange={(c) => field.onChange(c.name)} />
          </FormControl>
        </div>
      )}
    />
  )
}

export default CreateChainField
