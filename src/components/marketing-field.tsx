import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import { z } from 'zod'
import { UseFormReturn } from 'react-hook-form'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { MarketType, Marketing } from '@/api/token/types'
import { Checkbox } from '@/components/ui/checkbox'
import { fmt } from '@/utils/fmt'
import { Dialog, DialogFooter } from '@/components/ui/dialog'
import { DialogContent, DialogTitle } from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import { CheckedState } from '@radix-ui/react-checkbox'
import { useTokenConfig } from '@/hooks/use-token-config'

const marketingActions = (
  value: Marketing[],
  m: { value: number; percent: number }
) => ({
  added: [...value, { type: m.value, percent: m.percent }],
  removed: value.filter((market) => market.type !== m.value),
})

export const marketingSchema = z.object({
  marketing: z
    .array(z.object({ type: z.number(), percent: z.number() }))
    .optional(),
})

interface Props {
  form: UseFormReturn<z.infer<typeof marketingSchema>>
  chainName: string
  disabled?: boolean
}

export const MarketingField = ({ form, disabled, chainName }: Props) => {
  const { t } = useTranslation()
  const { configValue } = useTokenConfig(chainName)
  const { distributionRatioKol = 0 } = configValue ?? {}

  const markets = [
    {
      title: t('marketing.kol').replace(
        '{}',
        fmt.percent(distributionRatioKol, { fixed: 0 })
      ),
      desc: t('marketing.kol.desc').replace(
        '{}',
        fmt.percent(distributionRatioKol, { fixed: 0 })
      ),
      value: MarketType.Kol,
      percent: distributionRatioKol,
    },
    // {
    //   title: t('marketing.community')
    //     .replace('{}', fmt.percent(0, { fixed: 0 }))
    //     .replace('{}', ''),
    //   desc: t('marketing.community.desc').replace(
    //     '{}',
    //     fmt.percent(0, { fixed: 0 })
    //   ),
    //   value: MarketType.Community,
    //   percent: 0,
    // },
  ]

  // Default checke.
  useEffect(() => {
    form.setValue('marketing', [
      {
        type: MarketType.Kol,
        percent: distributionRatioKol,
      },
    ])
  }, [])

  return (
    <div className="!mt-5">
      <p className="font-bold text-sm">{t('marketing')}</p>
      {markets.map((m) => (
        <FormField
          key={m.value}
          control={form.control}
          name="marketing"
          render={({ field }) => {
            const checked = field.value?.some((v) => v.type === m.value)
            return (
              <>
                <FormItem className="flex items-center space-x-2 mt-2">
                  <FormControl>
                    <Checkbox
                      disabled={field.disabled || disabled}
                      checked={checked}
                      onCheckedChange={(checked: CheckedState) => {
                        const value = field.value as Marketing[]
                        const { added, removed } = marketingActions(value, m)
                        field.onChange(checked ? added : removed)
                      }}
                    />
                  </FormControl>
                  <FormLabel className="flex items-center !mt-0 gap-1">
                    {m.title}
                    <DialogMarketing type={m.value} chainName={chainName} />
                  </FormLabel>
                </FormItem>
                {!checked && (
                  <p className="text-xs text-yellow-600">
                    <Trans
                      i18nKey="marketing.burn-desc"
                      values={{ percent: m.percent }}
                      components={{ bold: <strong></strong> }}
                    />
                  </p>
                )}
              </>
            )
          }}
        />
      ))}
    </div>
  )
}

export default MarketingField

export const DialogMarketing = ({
  type,
  chainName,
}: {
  type: MarketType
  chainName: string
}) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const { configValue } = useTokenConfig(chainName)
  const [isKol, isCommunity] = useMemo(
    () => [type === MarketType.Kol, type === MarketType.Community],
    [type]
  )
  const {
    walletCountKol = 0,
    distributionRatioKol = 0,
    walletCountCommunity = 0,
    distributionRatioCommunity = 0,
  } = configValue ?? {}
  const burnCountdown = 48 // hours

  return (
    <>
      <InfoCircledIcon
        className="cursor-pointer"
        onClick={(e) => {
          setOpen(true)
          e.stopPropagation()
          e.preventDefault()
        }}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="flex justify-center">
          <span className="!text-xl">
            {isKol ? t('kol.marketing') : t('community.marketing')}
          </span>
        </DialogTitle>

        <DialogContent>
          <img
            src="/images/airdrop-desc.png"
            alt="Airdrop"
            className="w-[125px] h-[125px] mb-5 mx-auto"
          />
          {isKol && (
            <p className="mb-2">
              <Trans
                i18nKey="airdrop.kol.desc1"
                values={{
                  percent: distributionRatioKol,
                  count: walletCountKol,
                  rewardPercent: distributionRatioKol / walletCountKol,
                }}
                components={{ bold: <strong></strong> }}
              />
            </p>
          )}
          {isCommunity && (
            <p className="mb-2">
              <Trans
                i18nKey="airdrop.kol.desc1"
                values={{
                  percent: distributionRatioKol,
                  count: walletCountKol,
                  rewardPercent: distributionRatioKol / walletCountKol,
                }}
                components={{ bold: <strong></strong> }}
              />
            </p>
          )}
          <p className="mb-3">
            <Trans
              i18nKey="airdrop.kol.desc2"
              values={{ countdown: burnCountdown }}
              components={{ bold: <strong></strong> }}
            />
          </p>
          {isKol ? (
            <>
              <p className="mb-3">{t('airdrop.kol.desc3')}</p>
              <p>{t('airdrop.kol.desc4')}</p>
            </>
          ) : (
            <>
              <p className="mb-3">{t('airdrop.community.desc3')}</p>
              <p>{t('airdrop.community.desc4')}</p>
            </>
          )}
        </DialogContent>
        <DialogFooter className="!justify-center">
          <Button onClick={() => setOpen(false)}>OK</Button>
        </DialogFooter>
      </Dialog>
    </>
  )
}
