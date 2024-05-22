import React, { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'lodash'
import Link from 'next/link'
import { formatEther } from 'viem'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { type Field, createField, useFields } from '@/hooks/use-fields'
import { FormInputField, FormTextareaField } from '@/components/form-field'
import { useDeploy } from '../hooks/use-deploy'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { Routes } from '@/routes'
import { Title } from './title'
import { useUploadImage } from '@/hooks/use-upload-image'
import { useWalletStore } from '@/stores/use-wallet-store'

interface Props extends Omit<ComponentProps<'form'>, 'onSubmit'> {}

export const CreateTokenForm = (props: Props) => {
  const { className } = props
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
  const {
    contractAddr,
    deployFee,
    deploySymbol,
    isDeploying,
    deployHash,
    isSuccess,
    deploy,
    resetDeploy,
  } = useDeploy()
  const { url, onChangeUpload } = useUploadImage()
  const { isConnected } = useAccount()
  const { setConnectOpen } = useWalletStore()

  const fee = Number(formatEther(BigInt(deployFee))).toFixed(3)
  const symbol = deploySymbol

  function emptyValid(f: Field) {
    return isEmpty(f.value) ? t('field.empty') : null
  }

  const withOptional = (value: string) => `${value}(${t('optional')})`

  const onChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateField(target.id as keyof typeof fields, { value: target.value })
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    toast.dismiss()

    if (!isConnected) return setConnectOpen(true)
    if (isDeploying) return
    if (!validateFields()) return
    if (isEmpty(url)) {
      toast.error(t('create.upload-image'))
      return
    }

    deploy({
      name: fieldsValues.name,
      ticker: fieldsValues.symbol,
      desc: fieldsValues.description,
      image: url,
      twitter_url: fieldsValues.twitter,
      telegram_url: fieldsValues.telegram,
      website: fieldsValues.website,
    })
  }

  return (
    <div className={cn('w-96', className)}>
      <AlertDialog
        open={isSuccess}
        onOpenChange={resetDeploy}
        title={t('deploy.success')}
        description={
          <p className="flex flex-col gap-2">
            <Link
              className="text-blue-600 hover:underline "
              href={`https://scrollscan.com/tx/${deployHash}`}
              target="_blank"
            >
              {t('view.hash')}
            </Link>
            <Link
              className="text-blue-600 hover:underline "
              href={`${Routes.Token}/${contractAddr}`}
            >
              {t('view.details')}
            </Link>
            <Link className="text-blue-600 hover:underline " href={Routes.Main}>
              {t('view.list')}
            </Link>
          </p>
        }
      />
      <Title className="w-fit max-sm:px-3 max-sm:mt-10">
        {t('create.new')}
      </Title>
      <form
        className={cn(
          'flex flex-col space-y-3 w-[460px] max-sm:w-full max-sm:px-3 max-sm:space-y-2'
        )}
        onSubmit={onSubmit}
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
            disabled={isDeploying}
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
            disabled={isDeploying}
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
          disabled={isDeploying}
          onChange={onChange}
        />
        <FormInputField
          id="logo"
          label="Logo"
          placeholder={t('logo.placeholder')}
          type="file"
          isRequired
          disabled={isDeploying}
          accept="image/*"
          onChange={onChangeUpload}
        />

        {/* Optional fields. */}
        <FormInputField
          id="twitter"
          label={t('twitter-x')}
          placeholder={withOptional(t('twitter-x.placeholder'))}
          value={fields.twitter.value}
          disabled={isDeploying}
          onChange={onChange}
        />
        <FormInputField
          id="telegram"
          label={t('telegram')}
          placeholder={withOptional(t('telegram.placeholder'))}
          value={fields.telegram.value}
          disabled={isDeploying}
          onChange={onChange}
        />
        <FormInputField
          id="website"
          label={t('website')}
          placeholder={withOptional(t('website.placeholder'))}
          value={fields.website.value}
          disabled={isDeploying}
          onChange={onChange}
        />

        {/* Submit button */}
        <div className="flex flex-col items-center space-y-2">
          <Button className="self-center px-10 mt-3" disabled={isDeploying}>
            {t('create')}
          </Button>
          <p className="self-center text-zinc-400 text-xs">
            {t('deploy.fee')}: {fee} {symbol}
          </p>
        </div>
      </form>
    </div>
  )
}
