import React, { forwardRef, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatEther } from 'viem'
import { z } from 'zod'
import { toast } from 'sonner'
import { useSwitchChain } from 'wagmi'

import { aiApi } from '@/api/ai'
import { CreateTokenContext } from '../../context'
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
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { fmt } from '@/utils/fmt'
import { Dialog } from '@/components/ui/dialog'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useAimemeInfoStore } from '@/stores/use-ai-meme-info-store'
import { FormLogo } from './logo'

export const CreateTokenForm = forwardRef<{}, {}>((props, ref) => {
  const { t } = useTranslation()
  const { deployResult, formData, aiMemeInfo } = useContext(CreateTokenContext)
  const { switchChain } = useSwitchChain()
  const [showPoster, setShowPoster] = useState(false)
  const [index, setIndex] = useState(0)
  const [handLoadingPoster, setHandLoadingPoster] = useState(false)

  const { loadingLogo, loadingPoster: loadingPoster1 } = useAimemeInfoStore()

  const { url, form, chains, formFields, onSubmit } = formData
  const { isLoadingMemeInfo, isLoadingMemeImg, isLoadingMemePoster } =
    aiMemeInfo

  const { deployFee, deploySymbol, isDeploying } = deployResult || {}

  const fee = Number(formatEther(BigInt(deployFee!))).toFixed(3)
  const symbol = deploySymbol

  const onRight = () => {
    const limit = Number(form?.getValues(formFields?.poster!)?.length)
    setIndex((index) => {
      if (index === limit - 1) return 0
      return index + 1
    })
  }

  const onLeft = () => {
    const limit = Number(form?.getValues(formFields?.poster!)?.length)
    setIndex((index) => {
      if (index === 0) return limit - 1
      return index - 1
    })
  }

  const beforeSubmit = (values: any) => {
    if (isLoadingMemeInfo || isLoadingMemeImg) {
      toast.warning(t('onsubmit.createing.warning'))
      return
    }
    onSubmit!(values!)
  }

  const getAIMemePoster = async (e: any) => {
    e.preventDefault()

    const fullname = form?.getValues(formFields?.fullname!) as string
    const description = form?.getValues(formFields?.description!) as string
    if (!fullname || !description) {
      return toast.warning(t('need.base.info.warning'))
    }
    try {
      setHandLoadingPoster(true)
      const { data } = await aiApi.getMemePoster({
        name: fullname,
        description,
      })
      form?.setValue(formFields!.poster!, [...data.poster1, ...data.poster2])
    } catch {
    } finally {
      setHandLoadingPoster(false)
    }
  }

  const loadingPoster = isLoadingMemePoster || handLoadingPoster

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
              <div className="flex flex-col ml-5 items-center justify-between flex-1">
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

            {/* chain */}
            <FormField
              control={form?.control}
              name={formFields?.chainName!}
              render={({ field }) => (
                <FormItem className="mt-0">
                  <FormLabel className="mt-0">
                    *
                    {fmt.firstUpperCase(
                      chains?.find((c) => c.name === field.value)?.name
                    )}{' '}
                    {t('chain')}
                  </FormLabel>
                  <FormControl>
                    {chains ? (
                      <RadioGroup
                        onValueChange={(v: string) => {
                          form?.setValue(formFields?.chainName!, v)
                        }}
                        defaultValue={field.value}
                        className="flex w-max gap-0 border-2 border-black rounded-md overflow-hidden flex-wrap  max-sm:w-max"
                      >
                        {chains?.map((c, i) => (
                          <FormItem
                            key={i}
                            title={c.name}
                            className={cn(
                              'block p-1 min-w-[35px]',
                              c.name === field.value! ? 'bg-black' : '',
                              i !== chains.length - 1
                                ? 'border-r-2 border-black'
                                : ''
                            )}
                          >
                            <FormControl>
                              <RadioGroupItem
                                value={c.name}
                                disabled={!c.is_supported}
                                onClick={() => {
                                  switchChain({ chainId: Number(c.id) })
                                }}
                              >
                                <img
                                  src={c.logo}
                                  alt={c.name}
                                  about={c.name}
                                  className={cn(
                                    'w-[27px] h-[27px] block rounded-full overflow-hidden',
                                    !c.is_supported
                                      ? 'opacity-50 cursor-not-allowed'
                                      : ''
                                  )}
                                />
                              </RadioGroupItem>
                            </FormControl>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    ) : (
                      <div>{t('loading')}</div>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
          <FormField
            control={form?.control}
            name={formFields?.poster!}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="mr-2">
                    {loadingPoster ? t('ai.poster.tip') : t('ai.poster')}
                  </FormLabel>
                  <FormControl>
                    {loadingPoster ? (
                      <img src="/images/poster-loading.png" alt="loading" />
                    ) : !!field.value?.length ? (
                      <div className="flex gap-3 w-max max-md:w-[99%] max-md:overflow-x-auto">
                        {(field.value as string[])?.map((item, i) => {
                          return (
                            <div
                              key={item}
                              className={cn(
                                'flex-shrink-0 rounded-md overflow-hidden cursor-pointer',
                                i < 2
                                  ? 'w-[133px] h-[153px]'
                                  : 'w-[233px] h-[153px]'
                              )}
                              onClick={() => {
                                setShowPoster(true)
                                setIndex(i)
                              }}
                            >
                              <img src={item} alt="poster" />
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div>
                        <Button onClick={getAIMemePoster}>
                          {t('create.ai.poster')}
                        </Button>
                      </div>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />

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
      <Dialog open={showPoster} onOpenChange={() => setShowPoster(false)}>
        <div className="flex flex-col px-5 mt-5">
          <div className="absolute top-[50%] translate-y-[-50%] left-2 cursor-pointer">
            <FaChevronLeft size={26} onClick={onLeft}></FaChevronLeft>
          </div>
          <div className="absolute top-[50%] translate-y-[-50%] right-2 cursor-pointer">
            <FaChevronRight size={26} onClick={onRight}></FaChevronRight>
          </div>
          <img
            src={form?.getValues(formFields?.poster!)?.[index] as string}
            alt="Poster"
            className="w-full rounded-md mb-4 select-none"
          />
          <div className="flex justify-center">
            {(form?.getValues(formFields?.poster!) as string[])?.map(
              (item, i) => {
                return (
                  <div
                    key={item}
                    className={cn(
                      'w-[10px] h-[10px] mx-2 rounded-full cursor-pointer',
                      i === index ? 'bg-black' : 'bg-gray-300'
                    )}
                    onClick={() => setIndex(i)}
                  ></div>
                )
              }
            )}
          </div>
          <div
            className="mt-5  flex justify-center cursor-pointer"
            onClick={() =>
              open((form?.getValues(formFields?.poster!) as string[])[index])
            }
          >
            <Button>{t('download')}</Button>
          </div>
        </div>
      </Dialog>
    </>
  )
})

export default CreateTokenForm
