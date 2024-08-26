import { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { BigNumber } from 'bignumber.js'

import { Dialog, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCreateTokenContext } from '@/contexts/create-token'
import { FormField } from '@/components/ui/form'

export const InitialBuyField = ({
  onOpenChange,
  ...props
}: ComponentProps<typeof Dialog>) => {
  const { t } = useTranslation()
  const { buyAmoutMax, reserveSymbol, form, onSubmit } = useCreateTokenContext()

  return (
    <Dialog
      onOpenChange={(value) => {
        onOpenChange?.(value)
        if (!value) form.setValue('buyAmount', '')
      }}
      {...props}
      contentProps={{
        className: 'flex flex-col justify-center items-center',
        onInteractOutside: (e) => e.preventDefault(),
      }}
    >
      <DialogTitle>{t('create.buy-title')}</DialogTitle>
      <DialogDescription>{t('create.buy-desc')}</DialogDescription>
      <FormField
        control={form.control}
        name="buyAmount"
        render={({ field }) => (
          <Input
            autoFocus
            className="w-48"
            placeholder="0"
            value={field.value}
            onChange={({ target }) => {
              if (BigNumber(target.value).isNaN()) {
                field.onChange('')
                return
              }
              if (BigNumber(target.value).gt(buyAmoutMax)) {
                field.onChange(buyAmoutMax)
                return
              }
              field.onChange(target.value)
            }}
            endIcon={
              <p
                className="text-xs text-zinc-500 shrink-0 mr-2 cursor-pointer"
                onClick={() => field.onChange(buyAmoutMax)}
              >
                {t('max')}: {buyAmoutMax} {reserveSymbol}
              </p>
            }
          />
        )}
      />

      <Button
        className="w-48"
        onClick={() => {
          form.handleSubmit(onSubmit)()
          onOpenChange?.(false)
        }}
      >
        {t('confirm')}
      </Button>
    </Dialog>
  )
}

export default InitialBuyField
