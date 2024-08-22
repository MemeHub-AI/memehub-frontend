import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { BigNumber } from 'bignumber.js'
import { z } from 'zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LogoField } from './logo'
import { PosterField } from './poster'
import { fmt } from '@/utils/fmt'
import { useCreateTokenContext } from '@/contexts/create-token'
import { MarketingField } from '@/components/marketing-field'
import { useAimemeInfoStore } from '@/stores/use-ai-meme-info-store'
import { DescriptionField } from './desc'
import { ChainField } from './chain-field'
import { BuyDialogField } from './buy-dialog'

export const CreateTokenForm = () => {
  const { t } = useTranslation()
  const {
    url,
    form,
    formFields,
    onSubmit,
    isDeploying,
    deployFee,
    formSchema,
    reserveSymbol,
  } = useCreateTokenContext()
  const [open, setOpen] = useState(false)

  const { loadingInfo, loadingLogo } = useAimemeInfoStore()

  const isZeroFee = BigNumber(deployFee).isZero()
  const disabled = isDeploying || isZeroFee

  const onCreateClick = () => {
    if (loadingInfo || loadingLogo) {
      toast.warning(t('onsubmit.createing.warning'))
      return
    }
    setOpen(true)
  }

  useEffect(() => {
    if (url) {
      form?.setValue(formFields!.logo!, url)
    }
  }, [url])

  return (
    <Form {...form}>
      <form
        onSubmit={form?.handleSubmit(onSubmit)}
        className="flex flex-col space-y-3 max-sm:w-full max-sm:space-y-2"
      >
        {/* Loog/name/chain/symbol */}
        <div className="flex md:gap-5 max-sm:flex-col max-sm:space-y-2">
          <div className="flex">
            {/* Logo */}
            <LogoField />

            {/* name/symbol */}
            <div className="h-[150px] flex flex-col ml-5 items-center justify-between flex-1">
              <FormField
                control={form?.control}
                name={formFields?.fullname!}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="mt-0 font-bold">
                      *{t('name')}
                    </FormLabel>
                    <FormControl className="w-full">
                      <Input
                        placeholder={t('name.placeholder')}
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form?.control}
                name={formFields?.symbol!}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="font-bold">*{t('symbol')}</FormLabel>
                    <FormControl className="w-full">
                      <Input
                        placeholder={t('symbol.placeholder')}
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Chain / coinType */}
          <div className="h-[150px] flex flex-col justify-between max-sm:flex-row max-sm:h-min max-sm:justify-start max-sm:space-x-4 max-sm:flex-wrap">
            <ChainField />
            {/* <CoinTypeField /> */}
          </div>
        </div>

        {/* Marketing */}
        <MarketingField form={form} chainName={form.getValues('chainName')} />

        {/* Description */}
        <DescriptionField />

        {/* Poster */}
        <PosterField />

        {/* Twitter & telegram */}
        <div className="flex justify-between max-w-[500px]">
          <FormField
            control={form?.control}
            name={formFields?.twitter!}
            render={({ field }) => (
              <FormItem className="flex-1 mr-4">
                <FormLabel className="font-bold">{t('twitter-x')}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={t('twitter-x.placeholder')} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form?.control}
            name={formFields?.telegram!}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="font-bold">{t('telegram')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('telegram.placeholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Website */}
        <div className="flex justify-between max-w-[500px]">
          <FormField
            control={form?.control}
            name={formFields?.website!}
            render={({ field }) => (
              <FormItem className="flex-1 mr-4">
                <FormLabel className="font-bold">{t('website')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('website.placeholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex-1"></div>
        </div>

        {/* Submit button */}
        <div className="flex flex-col items-start space-y-3 max-w-[500px] max-sm:items-center">
          <BuyDialogField open={open} onOpenChange={setOpen} />
          <Button
            type="button"
            variant="default"
            className="px-10 mt-3"
            disabled={disabled}
            onClick={onCreateClick}
          >
            {isDeploying ? t('creating') : t('create')}
          </Button>

          <p className="text-zinc-400 text-xs">
            {isZeroFee
              ? t('deploy.unsupport.chain')
              : `${t('deploy.fee')} ≈ ${fmt.decimals(
                  deployFee
                )} ${reserveSymbol}`}
          </p>
        </div>
      </form>
    </Form>
  )
}

export default CreateTokenForm
