import React, { useEffect } from 'react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import { Dialog } from '../ui/dialog'
import { useAimemeInfoStore } from '@/stores/use-ai-meme-info-store'
import { aiApi } from '@/api/ai'
import { AIMemeInfo } from '@/api/ai/type'
import { useUserInfo } from '@/hooks/use-user-info'
import { useCheckAccount } from '@/hooks/use-check-chain'
import { useCreateTokenContext } from '@/contexts/create-token'

let memeInfoSign = new AbortController()

export const AICreateMemecoinDialogLoading = () => {
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
  const userStore = useUserInfo()
  const { checkForConnect } = useCheckAccount()
  const { form, formFields } = useCreateTokenContext()

  const fetchMemeInfo = async () => {
    if (!loadingInfo) {
      memeInfoSign.abort()
    }

    setLoadingInfo(true)
    memeInfoSign = new AbortController()
    try {
      form.setValue(formFields.fullname, '')
      form.setValue(formFields.symbol, '')
      form.setValue(formFields.description, '')

      const { data } = await aiApi.getMemeInfo(
        {
          input: info!.name!,
          background: info?.background,
        },
        memeInfoSign.signal
      )
      if (data) {
        fetchMemeImage(data)
      }
    } catch (e) {
    } finally {
      toast.dismiss()
      setLoadingInfoDialog(false)
      setLoadingInfo(false)
    }
  }

  const fetchMemeImage = (info?: AIMemeInfo) => {
    info = info

    if (info?.name) {
      form.setValue(formFields.fullname, info?.name)
      form.setValue(formFields.symbol, info?.symbol!)
    }

    if (info?.description) {
      form.setValue(formFields.description, info?.description)
    }

    if (info?.chainName) {
      form.setValue(formFields.chainName, info?.chainName)
    }
    setLoadingPoster(true)
    setLoadingLogo(true)
  }

  useEffect(() => {
    if (loadingInfoDialog && info?.name !== undefined && !loadingInfo) {
      if (userStore.userInfo?.id == null) {
        setLoadingInfoDialog(false)
        checkForConnect()
        return
      }
      fetchMemeInfo()
    }
  }, [loadingInfoDialog])

  useEffect(() => {
    return () => {
      toast.dismiss()
      memeInfoSign?.abort('')
      setLoadingInfoDialog(false)
      setLoadingInfo(false)
      setLoadingPoster(false)
      setLoadingLogo(false)
    }
  }, [])

  return (
    <Dialog
      open={loadingInfoDialog}
      onOpenChange={() => setLoadingInfoDialog(false)}
    >
      <div className="mt-4 text-center">
        <h2 className="text-xl text-center">
          {t('ai.creating').split('$')[0]}
        </h2>
        <h2 className="text-xl text-center">
          {t('ai.creating').split('$')[1]}
        </h2>
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
