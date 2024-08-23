import { useTranslation } from 'react-i18next'
import { BigNumber } from 'bignumber.js'

import { FormField, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useCreateIdeaDetailsContext } from '@/contexts/memex/create-idea-detail'
import { useChainInfo } from '@/hooks/use-chain-info'
import { useRouter } from 'next/router'

export const InitialBuyField = () => {
  const { t } = useTranslation()
  const { query } = useRouter()
  const { form, initialBuyMax } = useCreateIdeaDetailsContext()
  const { chain } = useChainInfo(query.chain as string)

  return (
    <FormField
      control={form.control}
      name="initialBuyAmount"
      render={({ field }) => (
        <div className="mt-2">
          <FormLabel className="font-bold">{t('create.buy-title')}</FormLabel>
          <div>
            <Input
              placeholder={t('create.buy-desc-short')}
              className="px-2"
              {...field}
              onChange={({ target }) => {
                const v = BigNumber(target.value)
                if (v.isNaN()) return field.onChange('')
                if (v.gt(initialBuyMax)) {
                  field.onChange(initialBuyMax)
                  return
                }

                field.onChange(target.value)
              }}
              disabled={field.disabled}
              inputClass="pl-0"
              endIcon={
                <p
                  className="cursor-pointer shrink-0 text-zinc-500 text-sm"
                  onClick={() => field.onChange(initialBuyMax)}
                >
                  {t('max')}: {initialBuyMax} {chain?.native.symbol}
                </p>
              }
            />
            <FormMessage />
          </div>
        </div>
      )}
    />
  )
}

export default InitialBuyField
