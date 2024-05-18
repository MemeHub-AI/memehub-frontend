import React, { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { type Field, createField, useFields } from '@/hooks/use-fields'
import { FormInputField, FormTextareaField } from '@/components/form-field'

interface Props extends Omit<ComponentProps<'form'>, 'onSubmit'> {
  fee: string
  symbol: string
  disabeld?: boolean
  onSubmit?: (data: Record<string, string>) => void
}

export const CreateTokenForm = (props: Props) => {
  const { fee, symbol, className, disabeld = false, onSubmit } = props
  const { t } = useTranslation()
  const { fields, fieldsValues, updateField, validateFields } = useFields({
    name: createField({
      isRequired: true,
      validate: emptyValid,
    }),
    symbol: createField({
      isRequired: true,
      validate: emptyValid,
    }),
    description: createField({
      isRequired: true,
      validate: emptyValid,
    }),
    twitter: createField({}),
    telegram: createField({}),
    website: createField({}),
  })

  function emptyValid(f: Field) {
    return isEmpty(f.value) ? t('field.empty') : null
  }

  const withOptional = (value: string) => `${value}(${t('optional')})`

  const onChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateField(target.id as keyof typeof fields, { value: target.value })
  }

  return (
    <form
      className={cn(
        'flex flex-col space-y-3 w-96 max-sm:w-full max-sm:px-3 max-sm:space-y-2',
        className
      )}
      onSubmit={(e) => {
        e.preventDefault()
        if (disabeld) return
        if (validateFields()) onSubmit?.(fieldsValues)
      }}
    >
      {/* Name/Symbol */}
      <div className="flex justify-between items-center gap-3">
        <FormInputField
          id="name"
          label={t('fullname')}
          placeholder={t('name.placeholder')}
          autoFocus
          isRequired={fields.name.isRequired}
          error={fields.name.error}
          value={fields.name.value}
          disabled={disabeld}
          onChange={onChange}
          autoComplete="off"
        />
        <FormInputField
          id="symbol"
          label={t('symbol')}
          placeholder={t('symbol.placeholder')}
          isRequired={fields.symbol.isRequired}
          error={fields.symbol.error}
          value={fields.symbol.value}
          disabled={disabeld}
          onChange={onChange}
          autoComplete="off"
        />
      </div>
      <FormTextareaField
        id="description"
        label={t('description')}
        rows={5}
        placeholder={t('description.placeholder')}
        isRequired={fields.description.isRequired}
        error={fields.description.error}
        value={fields.description.value}
        disabled={disabeld}
        onChange={onChange}
      />
      <FormInputField
        id="logo"
        label="Logo"
        placeholder={t('logo.placeholder')}
        type="file"
        isRequired
        disabled={disabeld}
      />

      {/* Optional fields. */}
      <FormInputField
        id="twitter"
        label={t('twitter-x')}
        placeholder={withOptional(t('twitter-x.placeholder'))}
        value={fields.twitter.value}
        disabled={disabeld}
        onChange={onChange}
      />
      <FormInputField
        id="telegram"
        label={t('telegram')}
        placeholder={withOptional(t('telegram.placeholder'))}
        value={fields.telegram.value}
        disabled={disabeld}
        onChange={onChange}
      />
      <FormInputField
        id="website"
        label={t('website')}
        placeholder={withOptional(t('website.placeholder'))}
        value={fields.website.value}
        disabled={disabeld}
        onChange={onChange}
      />

      {/* Submit button */}
      <div className="flex flex-col items-center space-y-2">
        <Button className="self-center px-10 mt-3" disabled={disabeld}>
          {t('create')}
        </Button>
        <p className="self-center text-zinc-400">
          {t('deploy.fee')}: {fee} {symbol}
        </p>
      </div>
    </form>
  )
}
