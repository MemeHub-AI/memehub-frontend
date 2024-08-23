import { LuRefreshCcw } from 'react-icons/lu'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'
import { toast } from 'sonner'
import { Router } from 'next/router'

import { Button } from '@/components/ui/button'
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { useAimemeInfoStore } from '@/stores/use-ai-meme-info-store'
import { Dialog } from '@/components/ui/dialog'
import { aiApi } from '@/api/ai'
import { useAudioPlayer } from '@/hooks/use-audio-player'
import { useCheckAccount } from '@/hooks/use-check-chain'
import { useCreateTokenContext } from '@/contexts/create-token'

let memePosterSign = new AbortController()

export const PosterField = () => {
  const { form, formFields } = useCreateTokenContext()
  const [showPoster, setShowPoster] = useState(false)
  const [index, setIndex] = useState(0)
  const { checkForConnect } = useCheckAccount()

  const { t } = useTranslation()
  const { loadingPoster, setLoadingPoster } = useAimemeInfoStore()
  const { playGuaGua } = useAudioPlayer()

  const onCreatePoster = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    e.stopPropagation()
    e.preventDefault()

    if (loadingPoster) return

    if (!checkForConnect()) return

    if (
      form.getValues(formFields?.fullname) === '' ||
      form.getValues(formFields?.description) === ''
    ) {
      toast.warning(t('need.name.desc.warning'))
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
    if (!checkForConnect()) return

    memePosterSign.abort('')
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
          form.setValue(formFields.poster, [...data.poster1, ...data.poster2])
        }
      })
      .finally(() => {
        setLoadingPoster(false)
      })
  }

  useEffect(() => {
    if (loadingPoster) {
      playGuaGua()
      fetchMemePoster()
    }
  }, [loadingPoster])

  useEffect(() => {
    const cb = () => {
      memePosterSign.abort('')
    }
    Router.events.on('routeChangeStart', cb)

    return () => {
      memePosterSign.abort('')
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
              <FormLabel className="font-bold">
                <div className="flex items-center">
                  {loadingPoster ? (
                    t('ai.poster.tip')
                  ) : (
                    <>
                      {t('ai.poster')}
                      <LuRefreshCcw
                        className={cn(
                          'ml-2',
                          loadingPoster ? 'animate-spin' : 'cursor-pointer'
                        )}
                        title="Regenerate"
                        onClick={onCreatePoster}
                      >
                        {t('create.ai.poster')}
                      </LuRefreshCcw>
                    </>
                  )}
                </div>
              </FormLabel>
              <FormControl>
                {loadingPoster ? (
                  <img src="/images/poster-loading.png" alt="loading" />
                ) : !!field.value?.length ? (
                  <>
                    <div className="flex space-x-3 w-max max-md:w-[99%] max-md:overflow-x-auto">
                      {(field.value as string[])?.map((item, i) => {
                        return (
                          <div
                            key={i}
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
                ) : null}
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />
      <Dialog open={showPoster} onOpenChange={() => setShowPoster(false)}>
        <div className="flex flex-col px-5 mt-5 max-sm:px-2 max-sm:mt-4">
          <div className="absolute top-[50%] translate-y-[-50%] left-2 max-sm:left-1 cursor-pointer">
            <FaChevronLeft size={26} onClick={onLeft}></FaChevronLeft>
          </div>
          <div className="absolute top-[50%] translate-y-[-50%] right-2 max-sm:right-1 cursor-pointer">
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
              index < 2
                ? 'w-[422px] h-[645px] max-h-[70vh] max-sm:h-[85%]'
                : 'w-[422px] h-[295px] max-h-[70vh] max-sm:h-[85%]',
              'rounded-md mb-4 select-none object-cover'
            )}
          />
          <div className="flex justify-center">
            {(form?.getValues(formFields?.poster!) as string[])?.map(
              (item, i) => {
                return (
                  <div
                    key={i}
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
