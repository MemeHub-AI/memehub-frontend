import { useTranslation } from 'react-i18next'
import { BigNumber } from 'bignumber.js'
import { useRouter } from 'next/router'

import { FormField, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useCreateIdeaDetailsContext } from '@/contexts/memex/create-idea-detail'
import { useChainInfo } from '@/hooks/use-chain-info'
import { utilLang } from '@/utils/lang'

export const InitialBuyField = () => {
  const { t } = useTranslation()
  const { query } = useRouter()
  const { form, isUpdating, initialBuyAmount, initialBuyMax } =
    useCreateIdeaDetailsContext()
  const { chain } = useChainInfo(query.chain as string)
  const { symbol } = chain?.native ?? {}

  return (
    <FormField
      control={form.control}
      name="initialBuyAmount"
      render={({ field }) => {
        const hasInitialBuy = BigNumber(initialBuyAmount).gt(0)
        const inputBuyAmount = BigNumber(field.value || 0)
        const remainingPayAmount = inputBuyAmount
          .minus(initialBuyAmount)
          .toFixed()

        return (
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
                disabled={field.disabled || isUpdating}
                inputClass="pl-0"
                endIcon={
                  <p
                    className="cursor-pointer shrink-0 text-zinc-500 text-sm"
                    onClick={() => field.onChange(initialBuyMax)}
                  >
                    {t('max')}: {initialBuyMax} {symbol}
                  </p>
                }
                onBlur={() => {
                  if (!hasInitialBuy) return
                  if (inputBuyAmount.lt(initialBuyAmount)) {
                    form.setError('initialBuyAmount', {
                      message: utilLang.replace(
                        t('create-idea.initial-buy-invalid'),
                        [initialBuyAmount]
                      ),
                    })
                    return
                  }
                }}
              />
              <FormMessage />
              {hasInitialBuy && inputBuyAmount.gt(initialBuyAmount) && (
                <p className="text-sm text-zinc-500">
                  {utilLang.replace(t('create-idea.initial-buy-tips'), [
                    `${initialBuyAmount} ${symbol}`,
                    `${remainingPayAmount} ${symbol}`,
                  ])}
                </p>
              )}
            </div>
          </div>
        )
      }}
    />
  )
}

export default InitialBuyField
