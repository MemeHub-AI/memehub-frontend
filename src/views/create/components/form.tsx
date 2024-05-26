import React, { forwardRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { useCreateTokenForm } from '../hooks/use-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import Input from '@/components/input'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import { formatEther } from 'viem'
import { useDeploy } from '../hooks/use-deploy'
import CreateTokenStatusDialog from './dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { AICreateMemecoinDialog } from '@/components/ai-create-memecoin-dialog'

interface Props {
  formData: ReturnType<typeof useCreateTokenForm>
  deployResult: ReturnType<typeof useDeploy>
}

export const CreateTokenForm = forwardRef<{}, Props>((props, ref) => {
  const { deployFee, deploySymbol, isDeploying } = props.deployResult
  const {
    form,
    chains,
    formFields,
    isLoadingMemeInfo,
    isLoadingMemeImg,
    onSubmit,
  } = props.formData
  const { t } = useTranslation()

  const fee = Number(formatEther(BigInt(deployFee))).toFixed(3)
  const symbol = deploySymbol

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            'flex flex-col space-y-3 w-[460px] max-sm:w-full max-sm:space-y-2'
          )}
        >
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>*{t('chain')}</FormLabel>
                <FormControl>
                  {chains ? (
                    <div>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex w-max gap-0 border-2 border-black rounded-md overflow-hidden"
                      >
                        {chains?.map((c, i) => (
                          <FormItem
                            key={i}
                            className={clsx(
                              'block p-1',
                              c.id === field.value! ? 'bg-black' : '',
                              i !== chains.length - 1
                                ? 'border-r-2 border-black'
                                : ''
                            )}
                          >
                            <FormControl>
                              <RadioGroupItem value={`${c.id}`}>
                                <img
                                  src={c.logo}
                                  alt={c.name}
                                  about={c.name}
                                  className="w-[35px] h-[35px] block rounded-full overflow-hidden"
                                />
                              </RadioGroupItem>
                            </FormControl>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </div>
                  ) : (
                    <div>{t('loading')}</div>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between items-center gap-3">
            <FormField
              control={form.control}
              name={formFields.fullname}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>*{t('fullname')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('name.placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={formFields.symbol}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>*{t('symbol')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('symbol.placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name={formFields.description}
            render={({ field }) => (
              <FormItem>
                <FormLabel>*{t('description.placeholder')}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t('description.placeholder')}
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={formFields.logo}
            render={({ field }) => (
              <FormItem>
                <FormLabel>*Logo</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('logo.placeholder')}
                    type="file"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={formFields.twitter}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('twitter-x')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('twitter-x.placeholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={formFields.telegram}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('telegram')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('telegram.placeholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={formFields.website}
            render={({ field }) => (
              <FormItem>
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
          {/* Submit button */}
          <div className="flex flex-col items-center space-y-2">
            <Button
              className="self-center px-10 mt-3"
              isShadow
              frontBgc="!bg-black"
              backBgc="!bg-white"
              frontTextColor="!text-white"
              disabled={isDeploying}
              type="submit"
            >
              {t('create')}
            </Button>
            <p className="self-center text-zinc-400 text-xs">
              {t('deploy.fee')}: {fee} {symbol}
            </p>
          </div>
        </form>
      </Form>
      <AICreateMemecoinDialog
        show={isLoadingMemeInfo}
        loading
      ></AICreateMemecoinDialog>
    </>
  )
})

export default CreateTokenForm
