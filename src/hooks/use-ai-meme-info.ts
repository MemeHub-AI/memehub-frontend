import { formFields } from './../views/create/hooks/use-form'
import { aiApi } from '@/api/ai'
import { useAimemeInfoStore } from '@/stores/use-ai-meme-info-store'
import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

export const abortController = {
  memeInfoSign: new AbortController(),
  memeImageSign: new AbortController(),
  memePosterSign: new AbortController(),
}

type Form = UseFormReturn<
  {
    [x: string]: string | string[] | undefined
  },
  any,
  undefined
>

interface Options {
  form?: Form
}

export const useAIMemeInfo = (options?: Options) => {
  const { form } = options || {}
  const [isLoadingMemeInfo, setIsLoadingMemeInfo] = useState(false)
  const [isLoadingMemeImg, setIsLoadingMemeImg] = useState(false)
  const [isLoadingMemePoster, setIsLoadingMemePoster] = useState(false)
  const { formInfo, setFormInfo } = useAimemeInfoStore()

  const getAIMemeImg = async () => {
    setIsLoadingMemeInfo(false)
    setIsLoadingMemeImg(true)
    setIsLoadingMemePoster(true)

    abortController.memeImageSign.abort()
    abortController.memePosterSign.abort()

    abortController.memeImageSign = new AbortController()
    abortController.memePosterSign = new AbortController()

    try {
      aiApi
        .getMemeImage(
          {
            name: formInfo?.name,
            description: formInfo?.description,
          },
          abortController.memeInfoSign.signal
        )
        .then(({ data }) => {
          if (data?.length) {
            form?.setValue(formFields.logo, data[0])
          }
        })
        .catch(() => {
          // toast.error(t('creating.meme.logo.error'))
        })
        .finally(() => {
          setIsLoadingMemeImg(false)
        })

      aiApi
        .getMemePoster(
          {
            name: formInfo?.name,
            description: formInfo?.description,
          },
          abortController.memePosterSign.signal
        )
        .then(({ data }) => {
          form?.setValue(formFields.poster, [...data.poster1, ...data.poster2])
        })
        .catch(() => {
          // toast.error(t('creating.meme.poster.error'))
        })
        .finally(() => {
          setIsLoadingMemePoster(false)
        })

      setFormInfo(undefined)
    } catch (error) {
      // toast.error(t('creating.meme.info.error'))
      setIsLoadingMemeImg(false)
      setIsLoadingMemePoster(false)
    } finally {
      setIsLoadingMemeInfo(false)
    }
  }

  const getAIMemeInfo = async (title: string) => {
    setIsLoadingMemeInfo(true)
    setIsLoadingMemeImg(true)
    setIsLoadingMemePoster(true)

    abortController.memeInfoSign.abort()
    abortController.memeImageSign.abort()
    abortController.memePosterSign.abort()

    abortController.memeInfoSign = new AbortController()
    abortController.memeImageSign = new AbortController()
    abortController.memePosterSign = new AbortController()

    try {
      const { data } = await aiApi.getMemeInfo(
        {
          input: title,
        },
        abortController.memeInfoSign.signal
      )

      setIsLoadingMemeInfo(false)
      form?.setValue(formFields.fullname, data.name)
      form?.setValue(formFields.symbol, data.symbol)
      form?.setValue(formFields.description, data.description)

      aiApi
        .getMemeImage(
          {
            name: data.name,
            description: data.description,
          },
          abortController.memeInfoSign.signal
        )
        .then(({ data }) => {
          if (data?.length) {
            form?.setValue(formFields.logo, data[0])
          }
        })
        .catch(() => {
          // toast.error(t('creating.meme.logo.error'))
        })
        .finally(() => {
          setIsLoadingMemeImg(false)
        })

      aiApi
        .getMemePoster(
          {
            name: data.name,
            description: data.description,
          },
          abortController.memePosterSign.signal
        )
        .then(({ data }) => {
          form?.setValue(formFields.poster, [...data.poster1, ...data.poster2])
        })
        .catch(() => {
          // toast.error(t('creating.meme.poster.error'))
        })
        .finally(() => {
          setIsLoadingMemePoster(false)
        })
    } catch (error) {
      // toast.error(t('creating.meme.info.error'))
      setIsLoadingMemeImg(false)
      setIsLoadingMemePoster(false)
    } finally {
      setIsLoadingMemeInfo(false)
    }
  }

  return {
    isLoadingMemeInfo,
    isLoadingMemeImg,
    isLoadingMemePoster,
    getAIMemeInfo,
    getAIMemeImg,
  }
}
