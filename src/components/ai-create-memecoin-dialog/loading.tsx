import React, { useEffect, useState } from 'react'
import { Dialog } from '../ui/dialog'
import { useAimemeInfoStore } from '@/stores/use-ai-meme-info-store'
import { useTranslation } from 'react-i18next'
import { aiApi } from '@/api/ai'
import { useCreateTokenForm } from '@/views/create/hooks/use-form'
import { AIMemeInfo } from '@/api/ai/type'
import { toast } from 'sonner'

interface Props {
  formHook: ReturnType<typeof useCreateTokenForm>
}

export const AICreateMemecoinDialogLoading = ({ formHook }: Props) => {
  const { t } = useTranslation()
  const {
    formInfo,
    info,
    loadingInfo,
    loadingImg,
    loadingLogo,
    loadingPoster,
    loadingInfoDialog,
    setLoadingInfo,
    setLoadingImg,
    setLoadingLogo,
    setLoadingPoster,
    setLoadingInfoDialog,
  } = useAimemeInfoStore()

  const fetchMemeInfo = async () => {
    setLoadingInfo(true)
    try {
      const { data } = await aiApi.getMemeInfo({
        input: info!.name!,
      })
      fetchMemeImage(data)
    } catch (e) {
      toast.error(t('create.info.error'))
    } finally {
      setLoadingInfoDialog(false)
      setLoadingInfo(false)
    }
  }

  const fetchMemeImage = (info?: AIMemeInfo) => {
    setLoadingLogo(true)
    setLoadingPoster(true)

    info = info || formInfo

    if (info?.name) {
      formHook.form.setValue(formHook.formFields.fullname, info?.name)
      formHook.form.setValue(formHook.formFields.symbol, info?.name)
    }

    if (info?.description) {
      formHook.form.setValue(formHook.formFields.description, info?.description)
    }

    aiApi
      .getMemeImage({
        name: info?.name!,
        description: info?.description!,
      })
      .then(({ data }) => {
        formHook.form.setValue(formHook.formFields.logo, data[0])
      })
      .finally(() => {
        setLoadingLogo(false)
        if (!loadingPoster) {
          setLoadingImg(false)
        }
      })

    aiApi
      .getMemePoster({
        name: info?.name!,
        description: info?.description!,
      })
      .then(({ data }) => {
        formHook.form.setValue(formHook.formFields.poster, [
          ...data.poster1,
          ...data.poster2,
        ])
      })
      .finally(() => {
        setLoadingPoster(false)
        if (!loadingLogo) {
          setLoadingImg(false)
        }
      })
  }

  useEffect(() => {
    if (loadingInfoDialog && info?.name !== undefined && !loadingInfo) {
      fetchMemeInfo()
    }
  }, [loadingInfoDialog, loadingInfo])

  useEffect(() => {
    if (loadingImg) {
      fetchMemeImage()
    }
  }, [loadingImg])

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
