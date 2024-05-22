import React, { forwardRef, useImperativeHandle } from 'react'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'

import { FormInputField, FormTextareaField } from '@/components/form-field'
import { type Field, createField, useFields } from '@/hooks/use-fields'

interface Props {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>
  disabled?: boolean
}

export interface CreateTokenFormFieldsMethods {
  fieldsValues: Record<string, string>
  validateFields: () => boolean
}

export const CreateTokenFormFields = React.forwardRef<
  CreateTokenFormFieldsMethods,
  Props
>((props, ref) => {
  const { disabled, onUpload } = props
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

  useImperativeHandle(ref, () => ({
    fieldsValues,
    validateFields,
  }))

  return (
    <>
      <div className="flex justify-between items-center gap-3">
        <FormInputField
          id="name"
          label={t('fullname')}
          placeholder={t('name.placeholder')}
          autoFocus
          isRequired={fields.name.isRequired}
          error={fields.name.error}
          value={fields.name.value}
          disabled={disabled}
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
          disabled={disabled}
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
        disabled={disabled}
        onChange={onChange}
      />
      <FormInputField
        id="logo"
        label="Logo"
        placeholder={t('logo.placeholder')}
        type="file"
        isRequired
        disabled={disabled}
        accept="image/*"
        onChange={onUpload}
      />

      {/* Optional fields. */}
      <FormInputField
        id="twitter"
        label={t('twitter-x')}
        placeholder={withOptional(t('twitter-x.placeholder'))}
        value={fields.twitter.value}
        disabled={disabled}
        onChange={onChange}
      />
      <FormInputField
        id="telegram"
        label={t('telegram')}
        placeholder={withOptional(t('telegram.placeholder'))}
        value={fields.telegram.value}
        disabled={disabled}
        onChange={onChange}
      />
      <FormInputField
        id="website"
        label={t('website')}
        placeholder={withOptional(t('website.placeholder'))}
        value={fields.website.value}
        disabled={disabled}
        onChange={onChange}
      />
    </>
  )
})

export default CreateTokenFormFields
