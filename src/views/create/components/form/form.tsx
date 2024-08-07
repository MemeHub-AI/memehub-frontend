import React, { forwardRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'

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
import { FormLogo } from './logo'
import { PosterForm } from './poster'
import { fmt } from '@/utils/fmt'
import { useCreateTokenContext } from '@/contexts/create-token'
import { MarketingField } from './marketing-field'
import { useAimemeInfoStore } from '@/stores/use-ai-meme-info-store'
import { Description } from './desc'
import { useChainsStore } from '@/stores/use-chains-store'
import { ChainField } from './chain-field'

export const CreateTokenForm = forwardRef<{}, {}>((props, ref) => {
  const { t } = useTranslation()
  const { deployResult, formData } = useCreateTokenContext()
  const { chain } = useAccount()

  const { url, form, formFields, onSubmit } = formData
  const { loadingInfo, loadingLogo } = useAimemeInfoStore()
  const { chainsMap } = useChainsStore()

  const { isDeploying, deployFee } = deployResult || {}

  const { native } = chainsMap[form.getValues(formFields.chainName)] || {}
  const symbol = native?.symbol || chain?.nativeCurrency.symbol || ''

  const beforeSubmit = (values: any) => {
    if (loadingInfo || loadingLogo) {
      toast.warning(t('onsubmit.createing.warning'))
      return
    }
    onSubmit!(values!)
  }

  useEffect(() => {
    if (url) {
      form?.setValue(formFields!.logo!, url)
    }
  }, [url])

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form?.handleSubmit(beforeSubmit)}
          className="flex flex-col space-y-3 max-sm:w-full max-sm:space-y-2"
        >
          {/* Loog/name/chain/symbol */}
          <div className="flex md:gap-5 max-sm:flex-col max-sm:space-y-2">
            <div className="flex">
              {/* Logo */}
              <FormLogo formData={formData}></FormLogo>

              {/* name/symbol */}
              <div className="h-[150px] flex flex-col ml-5 items-center justify-between flex-1">
                <FormField
                  control={form?.control}
                  name={formFields?.fullname!}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="mt-0 font-bold">
                        *{t('fullname')}
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
                      <FormLabel className="font-bold">
                        *{t('symbol')}
                      </FormLabel>
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
          <MarketingField />

          {/* Description */}
          <Description formData={formData} />

          {/* Poster */}
          <PosterForm formData={formData}></PosterForm>

          {/* Twitter & telegram */}
          <div className="flex justify-between max-w-[500px]">
            <FormField
              control={form?.control}
              name={formFields?.twitter!}
              render={({ field }) => (
                <FormItem className="flex-1 mr-4">
                  <FormLabel className="font-bold">{t('twitter-x')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t('twitter-x.placeholder')}
                    />
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
          <div className="flex flex-col items-start space-y-3 max-w-[500px]">
            <Button
              variant="default"
              className="px-10 mt-3"
              disabled={isDeploying}
            >
              {t('create')}
            </Button>
            {symbol && (
              <p className="text-zinc-400 text-xs">
                {t('deploy.fee')} ≈ {fmt.decimals(deployFee)} {symbol}
              </p>
            )}
          </div>
        </form>
      </Form>
    </>
  )
})

export default CreateTokenForm
