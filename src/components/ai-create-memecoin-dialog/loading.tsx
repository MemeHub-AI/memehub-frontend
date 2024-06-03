import React, { memo, useEffect } from 'react'
import { Dialog } from '../ui/dialog'
import { useAimemeInfoStore } from '@/stores/use-ai-meme-info-store'
import { useTranslation } from 'react-i18next'
import { aiApi } from '@/api/ai'
import { z } from 'zod'
import { useCreateToken } from '@/views/create/hooks/use-create-token'
import { useCreateTokenForm } from '@/views/create/hooks/use-form'
import { toast } from 'sonner'
import { AIMemeInfo } from '@/api/ai/type'

interface Props {
  formHook: ReturnType<typeof useCreateTokenForm>
}

export const AICreateMemecoinDialogLoading = ({ formHook }: Props) => {
  const { t } = useTranslation()
  const {
    formInfo,
    info,
    loading,
    loadingLogo,
    setLoading,
    setLoadingLogo,
    setLoadingPoster,
  } = useAimemeInfoStore()

  const fetchMemeInfo = async () => {
    const { data } = await aiApi.getMemeInfo({
      input: info!.name!,
    })
    setLoading(false)
    fetchMemeImage(data)
  }

  const fetchMemeImage = (info?: AIMemeInfo) => {
    setLoadingLogo(true)
    setLoadingPoster(true)

    info = info || formInfo

    if (info?.name) {
      formHook.form.setValue(formHook.formFields.fullname, info?.name)
      formHook.form.setValue(formHook.formFields.symbol, info?.name)
    }

    if (formInfo?.description) {
      formHook.form.setValue(
        formHook.formFields.description,
        formInfo?.description
      )
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
      })
  }

  useEffect(() => {
    if (loading && info?.name !== undefined) {
      fetchMemeInfo()
    }
  }, [info, loading])

  useEffect(() => {
    if (loadingLogo) {
      fetchMemeImage()
    }
  }, [loadingLogo])

  return (
    <Dialog open={loading} onOpenChange={() => setLoading(false)}>
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
