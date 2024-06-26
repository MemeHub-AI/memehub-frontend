import React, { useEffect } from 'react'
import { Dialog } from '../ui/dialog'
import { useAimemeInfoStore } from '@/stores/use-ai-meme-info-store'
import { useTranslation } from 'react-i18next'
import { aiApi } from '@/api/ai'
import { useCreateTokenForm } from '@/views/create/hooks/use-form'
import { AIMemeInfo } from '@/api/ai/type'
import { toast } from 'sonner'
import { Router } from 'next/router'

interface Props {
  formHook: ReturnType<typeof useCreateTokenForm>
}

let memeInfoSign = new AbortController()

export const AICreateMemecoinDialogLoading = ({ formHook }: Props) => {
  const { t } = useTranslation()
  const {
    info,
    loadingInfo,
    loadingInfoDialog,
    setLoadingInfo,
    setLoadingLogo,
    setLoadingPoster,
    setLoadingInfoDialog,
  } = useAimemeInfoStore()

  const fetchMemeInfo = async () => {
    if (!loadingInfo) {
      memeInfoSign.abort()
    }

    setLoadingInfo(true)
    memeInfoSign = new AbortController()
    try {
      formHook.form.setValue(formHook.formFields.fullname, '')
      formHook.form.setValue(formHook.formFields.symbol, '')
      formHook.form.setValue(formHook.formFields.description, '')

      toast.loading(t('create.info.loading'))

      const { data } = await aiApi.getMemeInfo(
        {
          input: info!.name!,
        },
        memeInfoSign.signal
      )
      if (data) {
        fetchMemeImage(data)
      }
    } catch (e) {
      toast.error(t('create.info.error'))
    } finally {
      toast.dismiss()
      setLoadingInfoDialog(false)
      setLoadingInfo(false)
    }
  }

  const fetchMemeImage = (info?: AIMemeInfo) => {
    info = info

    if (info?.name) {
      formHook.form.setValue(formHook.formFields.fullname, info?.name)
      formHook.form.setValue(formHook.formFields.symbol, info?.symbol)
    }

    if (info?.description) {
      formHook.form.setValue(formHook.formFields.description, info?.description)
    }

    if (info?.chainName) {
      formHook.form.setValue(formHook.formFields.chainName, info?.chainName)
    }
    setLoadingPoster(true)
    setLoadingLogo(true)
  }

  useEffect(() => {
    if (loadingInfoDialog && info?.name !== undefined && !loadingInfo) {
      fetchMemeInfo()
    }
  }, [loadingInfoDialog])

  useEffect(() => {
    const cb = () => {
      memeInfoSign.abort()
      setLoadingInfoDialog(false)
      setLoadingInfo(false)
      setLoadingPoster(false)
      setLoadingLogo(false)
    }
    Router.events.on('routeChangeStart', cb)

    return () => {
      toast.dismiss()
      Router.events.off('routeChangeStart', cb)
    }
  }, [])
  return (
    <Dialog
      open={loadingInfoDialog}
      onOpenChange={() => setLoadingInfoDialog(false)}
    >
      <div className="mt-4 text-center">
        <h1 className="text-xl text-center">{t('ai.creating')}</h1>
        <h1 className="text-xl text-center">{t('wait')}</h1>
      </div>
      <div>
        <img
          src="/images/ai-loding.webp"
          alt="BabyPEPE"
          className="w-[95%] object-cover mx-auto my-4 rounded-md"
        />
      </div>
    </Dialog>
  )
}
