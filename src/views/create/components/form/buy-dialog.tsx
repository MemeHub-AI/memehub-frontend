import { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { BigNumber } from 'bignumber.js'

import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCreateTokenContext } from '@/contexts/create-token'
import { FormField } from '@/components/ui/form'

export const BuyDialogField = ({ ...props }: ComponentProps<typeof Dialog>) => {
  const { t } = useTranslation()
  const { buyAmoutMax, reserveSymbol, form, onSubmit } = useCreateTokenContext()

  return (
    <Dialog
      {...props}
      contentProps={{
        className: 'flex flex-col justify-center items-center',
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

      <DialogClose>
        <Button className="w-48" onClick={() => form.handleSubmit(onSubmit)}>
          {t('confirm')}
        </Button>
      </DialogClose>
    </Dialog>
  )
}

export default BuyDialogField
