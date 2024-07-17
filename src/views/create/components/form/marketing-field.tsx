import React, { use, useEffect, useState } from 'react'
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
import { fmt } from '@/utils/fmt'
import { Dialog, DialogFooter } from '@/components/ui/dialog'
import { DialogContent, DialogTitle } from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'

const kolPercent = 0.02

const communityName = 'BNB'
const communityPercent = 0.05

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
      title: t('marketing.kol').replace('{}', fmt.percent(kolPercent)),
      desc: t('marketing.kol.desc').replace('{}', fmt.percent(kolPercent)),
      value: MarketType.Kol,
      percent: kolPercent,
    },
    {
      title: t('marketing.community')
        .replace('{}', fmt.percent(communityPercent))
        .replace('{}', ''),
      desc: t('marketing.community.desc').replace(
        '{}',
        fmt.percent(communityPercent)
      ),
      value: MarketType.Community,
      percent: communityPercent,
    },
    // {
    //   title: t('marketing.memehub')
    //     .replace('{}', fmt.percent(memehubPercent))
    //     .replace('{}', memehubName),
    //   desc: t('marketing.memehub.desc')
    //     .replace('{}', fmt.percent(memehubPercent))
    //     .replace('{}', memehubName),
    //   value: MarketType.Memehub,
    //   percent: memehubPercent,
    //   disabled: true,
    // },
  ]

  // Default checked.
  useEffect(() => {
    form.setValue(formFields.marketing, [
      {
        type: MarketType.Kol,
        percent: kolPercent,
      },
      {
        type: MarketType.Community,
        percent: communityPercent,
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
          name={formFields.marketing}
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2 mt-2">
              <FormControl>
                <Checkbox
                  // disabled={m.disabled}
                  checked={field.value?.some((v) => v.type === m.value)}
                  onCheckedChange={(checked) => {
                    const value = field.value as Marketing[]
                    const { added, removed } = marketingActions(value, m)

                    field.onChange(checked ? added : removed)
                  }}
                />
              </FormControl>
              <FormLabel className="flex items-center !mt-0 gap-1">
                {m.title}
                <DialogMarketing type={m.value}></DialogMarketing>
              </FormLabel>
            </FormItem>
          )}
        />
      ))}
    </div>
  )
}

export default MarketingField

interface DialogProps {
  type: MarketType
}

const kol = {
  airdropCount: 2,
  total: 100,
  perCount: 0.002,
  destroyed: 48,
}

const community = {
  airdropCount: 5,
  total: 500,
  perCount: 0.001,
  destroyed: 48,
}

export const DialogMarketing = ({ type }: DialogProps) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

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
            {type === MarketType.Kol
              ? t('kol.marketing')
              : t('community.marketing')}
          </span>
        </DialogTitle>

        <DialogContent>
          <img
            src="/images/airdrop-desc.png"
            alt="Airdrop"
            className="w-[125px] h-[125px] mb-5 mx-auto"
          />

          {type === MarketType.Kol ? (
            <>
              <p
                className="mb-3"
                dangerouslySetInnerHTML={{
                  __html: t('airdrop.kol.desc1')
                    .replace(
                      '$1',
                      `<span className="font-bold">${kol.airdropCount}</span>`
                    )
                    .replace(
                      '$2',
                      `<span className="font-bold">${kol.total}</span>`
                    )
                    .replace(
                      '$3',
                      `<span className="font-bold">${kol.perCount}</span>`
                    ),
                }}
              ></p>
              <p
                className="mb-3"
                dangerouslySetInnerHTML={{
                  __html: t('airdrop.kol.desc2').replace(
                    '$1',
                    `<span className="font-bold">${kol.destroyed}</span>`
                  ),
                }}
              ></p>
              <p className="mb-3">{t('airdrop.kol.desc3')}</p>
              <p>{t('airdrop.kol.desc4')}</p>
            </>
          ) : (
            <>
              <p
                className="mb-3"
                dangerouslySetInnerHTML={{
                  __html: t('airdrop.community.desc1')
                    .replace(
                      '$1',
                      `<span className="font-bold">${community.airdropCount}</span>`
                    )
                    .replace(
                      '$2',
                      `<span className="font-bold">${community.total}</span>`
                    )
                    .replace(
                      '$3',
                      `<span className="font-bold">${community.perCount}</span>`
                    ),
                }}
              ></p>
              <p
                className="mb-3"
                dangerouslySetInnerHTML={{
                  __html: t('airdrop.community.desc2').replace(
                    '$1',
                    `<span className="font-bold">${community.destroyed}</span>`
                  ),
                }}
              ></p>
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
