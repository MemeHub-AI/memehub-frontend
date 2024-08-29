import React from 'react'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'
import { BigNumber } from 'bignumber.js'

import { AlertDialog } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { maxSlippage, slippages } from '@/config/trade'

interface Props {
  value: string
  disabled?: boolean
  onChange?: (value: string) => void
}

export const SlippageButton = (props: Props) => {
  const { disabled, value, onChange } = props
  const { t } = useTranslation()

  return (
    <div className="flex justify-between w-full gap-2">
      <AlertDialog
        triggerProps={{ asChild: true }}
        title={<p>{t('slippage.title')}</p>}
        description={t('slippage.description')}
        content={
          <div className="flex items-center gap-2 max-sm:flex-wrap">
            {slippages.map((s) => (
              <Button
                key={s}
                shadow="none"
                onClick={() => onChange?.(s)}
                className={cn(
                  value === s && 'bg-black text-white hover:bg-black'
                )}
              >
                {s}%
              </Button>
            ))}
            <Input
              value={value}
              onChange={({ target: { value } }) => {
                if (isEmpty(value)) return onChange?.(value)
                if (BigNumber(value).gt(maxSlippage)) {
                  return onChange?.(maxSlippage)
                }
                if (BigNumber(value).isNaN()) return
                onChange?.(value)
              }}
              endIcon={
                <p
                  className="mx-2 text-sm cursor-pointer select-none shrink-0"
                  onClick={() => onChange?.(maxSlippage)}
                >
                  {t('max')}
                </p>
              }
              autoFocus
              className="h-9"
            />
            <span>%</span>
          </div>
        }
      >
        <Button size="xs" shadow="none" disabled={disabled}>
          {t('set-max-slippage')}({value}%)
        </Button>
      </AlertDialog>
    </div>
  )
}

export default SlippageButton
