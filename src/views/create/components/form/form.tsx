import React, { forwardRef, useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { formatEther } from 'viem'
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
import { Input } from '@/components/input'
import { Textarea } from '@/components/ui/textarea'
import { FormLogo } from './logo'
import { FormChain } from './chain'
import { PosterForm } from './poster'
import { DEPLOY_FEE } from '@/contract/v2/config/bond'
import { fmt } from '@/utils/fmt'
import { useCreateTokenContext } from '@/contexts/create-token'

export const CreateTokenForm = forwardRef<{}, {}>((props, ref) => {
  const { t } = useTranslation()
  const { deployResult, formData, aiMemeInfo } = useCreateTokenContext()
  const { chain } = useAccount()

  const { url, form, chains, formFields, onSubmit } = formData
  const { isLoadingMemeInfo, isLoadingMemeImg, isLoadingMemePoster } =
    aiMemeInfo

  const { isDeploying } = deployResult || {}

  const fee = fmt.decimals(formatEther(DEPLOY_FEE), 3)
  const symbol = chain?.nativeCurrency.symbol || ''

  const beforeSubmit = (values: any) => {
    if (isLoadingMemeInfo || isLoadingMemeImg) {
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
          <div className="flex gap-5 max-sm:flex-col max-sm:gap-1">
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
                      <FormLabel className="mt-0">*{t('fullname')}</FormLabel>
                      <FormControl className="w-full">
                        <Input
                          placeholder={t('name.placeholder')}
                          {...field}
                          className="w-full"
                          inputClassName="w-full"
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
                      <FormLabel>*{t('symbol')}</FormLabel>
                      <FormControl className="w-full">
                        <Input
                          placeholder={t('symbol.placeholder')}
                          {...field}
                          className="w-full"
                          inputClassName="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Chain / coinType */}
            <div className="h-[150px] flex flex-col justify-between">
              <FormChain formData={formData} />

              <div>cointype</div>
            </div>
          </div>

          {/* Description */}
          <FormField
            control={form?.control}
            name={formFields?.description!}
            render={({ field }) => (
              <FormItem className="max-w-[500px]">
                <FormLabel>*{t('description.placeholder')}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t('description.placeholder')}
                    rows={5}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Poster */}
          <PosterForm formData={formData}></PosterForm>

          {/* Twitter & telegram */}
          <div className="flex justify-between max-w-[500px]">
            <FormField
              control={form?.control}
              name={formFields?.twitter!}
              render={({ field }) => (
                <FormItem className="flex-1 mr-4">
                  <FormLabel>{t('twitter-x')}</FormLabel>
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
                  <FormLabel>{t('telegram')}</FormLabel>
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
                  <FormLabel>{t('website')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('website.placeholder')}
                      type="url"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form?.control}
              name={formFields?.website!}
              render={({ field }) => (
                <FormItem className="flex-1 opacity-0">
                  <FormLabel>{t('website')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('website.placeholder')}
                      type="url"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit button */}
          <div className="flex flex-col items-start gap-3 max-w-[500px]">
            <Button
              variant="default"
              className="px-10 mt-3"
              disabled={isDeploying}
            >
              {t('create')}
            </Button>
            {symbol && (
              <p className="text-zinc-400 text-xs">
                {t('deploy.fee')}: {fee} {symbol}
              </p>
            )}
          </div>
        </form>
      </Form>
    </>
  )
})

export default CreateTokenForm
