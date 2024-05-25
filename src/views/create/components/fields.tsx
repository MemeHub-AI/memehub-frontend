import React, { forwardRef, useImperativeHandle } from 'react'
import { useTranslation } from 'react-i18next'
import { chain, isEmpty } from 'lodash'

import { FormTextareaField } from '@/components/form-field'
import { FormInputField } from '@/components/form-input-field'
import { type Field, createField, useFields } from '@/hooks/use-fields'
import { FromRadioField } from '@/components/form-radio-field'

interface Props {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>
  disabled?: boolean
}

export interface CreateTokenFormFieldsMethods {
  fieldsValues: Record<string, string>
  validateFields: () => boolean
}

export const CreateTokenFormFields = forwardRef<
  CreateTokenFormFieldsMethods,
  Props
>((props, ref) => {
  const { disabled, onUpload } = props
  const { t } = useTranslation()

  const chainId = '1'
  const chains = [
    {
      label: 'Ethereum',
      value: '1',
    },
    {
      label: 'Binance Smart Chain',
      value: '56',
    },
  ]

  const { fields, fieldsKeys, fieldsValues, updateField, validateFields } =
    useFields({
      chainId: createField({
        isRequired: true,
        validate: emptyValid,
      }),
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
        {/* <FromRadioField
          id={fieldsKeys.chainId}
          label={t('chain')}
          isRequired={fields.chainId.isRequired}
          error={fields.chainId.error}
          value={chains as unknown as string}
          disabled={disabled}
          onChange={onChange}
          defaultValue={chainId}
          autoComplete="off"
        /> */}
        <FormInputField
          id={fieldsKeys.name}
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
          id={fieldsKeys.symbol}
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
        id={fieldsKeys.description}
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
        id={fieldsKeys.twitter}
        label={t('twitter-x')}
        placeholder={withOptional(t('twitter-x.placeholder'))}
        value={fields.twitter.value}
        disabled={disabled}
        onChange={onChange}
      />
      <FormInputField
        id={fieldsKeys.telegram}
        label={t('telegram')}
        placeholder={withOptional(t('telegram.placeholder'))}
        value={fields.telegram.value}
        disabled={disabled}
        onChange={onChange}
      />
      <FormInputField
        id={fieldsKeys.website}
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
