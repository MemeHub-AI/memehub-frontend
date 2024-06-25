import React from 'react'
import { useTranslation } from 'react-i18next'
import { InfoCircledIcon } from '@radix-ui/react-icons'

import { useCreateTokenContext } from '@/contexts/create-token'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { MarketType, Marketing } from '@/api/token/types'
import { Checkbox } from '@/components/ui/checkbox'
import { Tooltip } from '@/components/ui/tooltip'
import { fmt } from '@/utils/fmt'

const KolPercent = 0.02

const CommunityName = 'BNB'
const CommunityPercent = 0.05

const memehubName = 'Memehub'
const memehubPercent = 0.05

const marketingActions = (
  value: Marketing[],
  m: { value: number; percent: number }
) => ({
  added: [...value, { type: m.value, percent: m.percent }],
  removed: value.filter((market) => market.type !== m.value),
})

export const MarketingField = () => {
  const { t } = useTranslation()
  const {
    formData: { form, formFields },
  } = useCreateTokenContext()

  const markets = [
    {
      title: t('marketing.kol').replace('{}', fmt.percent(KolPercent)),
      desc: t('marketing.kol.desc').replace('{}', fmt.percent(KolPercent)),
      value: MarketType.Kol,
      percent: KolPercent,
    },
    {
      title: t('marketing.community')
        .replace('{}', fmt.percent(CommunityPercent))
        .replace('{}', ''),
      desc: t('marketing.community.desc').replace(
        '{}',
        fmt.percent(CommunityPercent)
      ),
      value: MarketType.Community,
      percent: CommunityPercent,
    },
    {
      title: t('marketing.memehub')
        .replace('{}', fmt.percent(memehubPercent))
        .replace('{}', memehubName),
      desc: t('marketing.memehub.desc')
        .replace('{}', fmt.percent(memehubPercent))
        .replace('{}', memehubName),
      value: MarketType.Memehub,
      percent: memehubPercent,
      disabled: true,
    },
  ]

  return (
    <div className="!mt-5">
      <p className="font-bold text-sm">{t('marketing')}</p>
      {markets.map((m) => (
        <FormField
          key={m.value}
          control={form.control}
          name={formFields.marketing}
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 mt-2">
              <FormControl>
                <Checkbox
                  disabled={m.disabled}
                  onCheckedChange={(checked) => {
                    const value = field.value as Marketing[]
                    const { added, removed } = marketingActions(value, m)

                    field.onChange(checked ? added : removed)
                  }}
                />
              </FormControl>
              <FormLabel className="flex items-center !mt-0 gap-1">
                {m.title}
                <Tooltip tip={m.desc}>
                  <InfoCircledIcon className="cursor-pointer" />
                </Tooltip>
              </FormLabel>
            </FormItem>
          )}
        />
      ))}
    </div>
  )
}

export default MarketingField
