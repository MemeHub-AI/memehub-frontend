import React from 'react'
import { useTranslation } from 'react-i18next'

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
import { TokenType } from '@/enums/token'

export const CoinTypeField = () => {
  const { t } = useTranslation()
  const { form } = useCreateTokenContext()

  const types = [
    {
      title: t('deploy.coin-type.normal'),
      desc: t('deploy.coin-type.normal.desc'),
      value: TokenType.Normal,
    },
    // {
    //   title: t('deploy.coin-type.erc404'),
    //   desc: t('deploy.coin-type.erc404.desc'),
    //   value: CoinType.Erc404,
    //   disabled: true,
    // },
    // {
    //   title: t('deploy.coin-type.reward-lp'),
    //   desc: t('deploy.coin-type.reward-lp.desc').replace('{}', '3%'),
    //   value: CoinType.RewardLp,
    //   disabled: true,
    // },
    // {
    //   title: t('deploy.coin-type.reward-holder'),
    //   desc: t('deploy.coin-type.reward-holder.desc').replace('{}', '3%'),
    //   value: CoinType.RewardHolder,
    //   disabled: true,
    // },
    // {
    //   title: t('deploy.coin-type.burning'),
    //   desc: t('deploy.coin-type.burning.desc'),
    //   value: CoinType.Burning,
    //   disabled: true,
    // },
  ]

  return (
    <FormField
      control={form.control}
      name="coinType"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-bold">{t('deploy.coin-type')}</FormLabel>
          <FormControl>
            <Select
              defaultValue={TokenType.Normal.toString()}
              onValueChange={field.onChange}
            >
              <SelectTrigger className="w-min" shadow="none">
                {types.find((t) => t.value === Number(field.value))?.title}
              </SelectTrigger>
              <SelectContent viewportClass="p-0 max-w-80">
                {types.map((t) => (
                  <SelectItem
                    key={t.value}
                    value={t.value.toString()}
                    className="border-b-2 border-black rounded-none m-0 last:border-none  p-3"
                    // disabled={t.disabled}
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
