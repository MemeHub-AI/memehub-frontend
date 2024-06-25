import { Button } from '@/components/ui/button'
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { LuRefreshCcw } from 'react-icons/lu'
import { useCreateTokenForm } from '../../hooks/use-form'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useAimemeInfoStore } from '@/stores/use-ai-meme-info-store'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'
import { Dialog } from '@/components/ui/dialog'
import { aiApi } from '@/api/ai'
import { toast } from 'sonner'
import { Router } from 'next/router'
import { useUserStore } from '@/stores/use-user-store'
import { useWalletStore } from '@/stores/use-wallet-store'

interface Props {
  formData: ReturnType<typeof useCreateTokenForm>
}

let memePosterSign = new AbortController()
export const PosterForm = ({ formData }: Props) => {
  const { form, formFields } = formData
  const [showPoster, setShowPoster] = useState(false)
  const [index, setIndex] = useState(0)
  const userStore = useUserStore()
  const { setConnectOpen } = useWalletStore()

  const { t } = useTranslation()
  const { loadingPoster, setLoadingPoster } = useAimemeInfoStore()
  const createPoster = (e: any) => {
    e.stopPropagation()
    e.preventDefault()

    if (userStore.userInfo?.id == null) {
      return setConnectOpen(true)
    }

    if (
      form.getValues(formFields?.fullname) === '' ||
      form.getValues(formFields?.description) === ''
    ) {
      toast.warning(t('need.base.info.warning'))
      return
    }

    if (loadingPoster) {
      toast.warning(t('ai.poster.tip'))
      return
    }

    setLoadingPoster(true)
  }

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

  const fetchMemePoster = () => {
    memePosterSign.abort()
    memePosterSign = new AbortController()
    aiApi
      .getMemePoster(
        {
          name: form.getValues(formFields?.fullname) as string,
          description: form.getValues(formFields?.description) as string,
        },
        memePosterSign.signal
      )
      .then(({ data }) => {
        if (data) {
          formData.form.setValue(formData.formFields.poster, [
            ...data.poster1,
            ...data.poster2,
          ])
        }
      })
      .finally(() => {
        setLoadingPoster(false)
      })
  }

  useEffect(() => {
    if (loadingPoster) {
      fetchMemePoster()
    }
  }, [loadingPoster])

  useEffect(() => {
    const cb = () => {
      memePosterSign.abort()
    }
    Router.events.on('routeChangeStart', cb)

    return () => {
      Router.events.off('routeChangeStart', cb)
    }
  }, [])
  return (
    <>
      <FormField
        control={form?.control}
        name={formFields?.poster!}
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel className="mr-2 font-bold">
                {loadingPoster ? (
                  t('ai.poster.tip')
                ) : field.value?.length ? (
                  <>
                    {t('ai.poster')}{' '}
                    <Button onClick={createPoster} className="ml-3">
                      <LuRefreshCcw className="mr-1"></LuRefreshCcw>{' '}
                      {t('switch.ai.poster')}
                    </Button>
                  </>
                ) : (
                  t('ai.poster')
                )}
              </FormLabel>
              <FormControl>
                {loadingPoster ? (
                  <img src="/images/poster-loading.png" alt="loading" />
                ) : !!field.value?.length ? (
                  <>
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
                  </>
                ) : (
                  <div>
                    <Button onClick={createPoster}>
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
      <Dialog open={showPoster} onOpenChange={() => setShowPoster(false)}>
        <div className="flex flex-col px-5 mt-5">
          <div className="absolute top-[50%] translate-y-[-50%] left-2 cursor-pointer">
            <FaChevronLeft size={26} onClick={onLeft}></FaChevronLeft>
          </div>
          <div className="absolute top-[50%] translate-y-[-50%] right-2 cursor-pointer">
            <FaChevronRight size={26} onClick={onRight}></FaChevronRight>
          </div>
          <img
            src={
              form
                ?.getValues(formFields?.poster!)
                ?.[index]?.replace('mini', 'origin') as string
            }
            alt="Poster"
            className={cn(
              index < 2 ? 'w-[422px] h-[645px]' : 'w-[422px] h-[295px]',
              'rounded-md mb-4 select-none'
            )}
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
              open(
                (form?.getValues(formFields?.poster!) as string[])[
                  index
                ].replace('mini', 'origin')
              )
            }
          >
            <Button>{t('download')}</Button>
          </div>
        </div>
      </Dialog>
    </>
  )
}
