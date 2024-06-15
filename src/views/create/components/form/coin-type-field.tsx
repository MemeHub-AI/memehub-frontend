import React from 'react'
import { useTranslation } from 'react-i18next'
import { ControllerRenderProps } from 'react-hook-form'

import { useCreateTokenContext } from '@/contexts/create-token'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/form'
import { CoinType } from '@/api/token/types'

export const CoinTypeField = () => {
  const { t } = useTranslation()
  const { formData } = useCreateTokenContext()
  const { formFields } = formData

  const types = [
    {
      title: t('deploy.coin-type.normal'),
      desc: t('deploy.coin-type.normal.desc'),
      value: CoinType.Normal,
    },
    {
      title: t('deploy.coin-type.erc404'),
      desc: t('deploy.coin-type.erc404.desc'),
      value: CoinType.Erc404,
    },
    {
      title: t('deploy.coin-type.reward-lp'),
      desc: t('deploy.coin-type.reward-lp.desc').replace('{}', '3%'),
      value: CoinType.RewardLp,
    },
    {
      title: t('deploy.coin-type.reward-holder'),
      desc: t('deploy.coin-type.reward-holder.desc').replace('{}', '3%'),
      value: CoinType.RewardHolder,
    },
    {
      title: t('deploy.coin-type.burning'),
      desc: t('deploy.coin-type.burning.desc'),
      value: CoinType.Burning,
    },
  ]

  const activeType = (
    field: ControllerRenderProps<Record<string, any>, string>
  ) => types.find((t) => t.value === Number(field.value))?.title

  return (
    <FormField
      control={formData.form.control}
      name={formFields.coinType}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-bold">{t('deploy.coin-type')}</FormLabel>
          <FormControl>
            <Select
              defaultValue={CoinType.Normal.toString()}
              onValueChange={field.onChange}
            >
              <SelectTrigger className="w-4/6 h-10" shadow="none">
                {activeType(field)}
              </SelectTrigger>
              <SelectContent viewportClass="p-0">
                {types.map((t) => (
                  <SelectItem
                    key={t.value}
                    value={t.value.toString()}
                    className="border-b-2 border-black rounded-none m-0 last:border-none  p-3"
                  >
                    <h3 className="font-bold text-base text-start">
                      {t.title}
                    </h3>
                    <p className="mt-1">{t.desc}</p>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  )
}

export default CoinTypeField
