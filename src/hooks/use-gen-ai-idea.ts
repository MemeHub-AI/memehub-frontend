import { Routes } from '@/routes'
import { useAimemeInfoStore } from '@/stores/use-ai-meme-info-store'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export const useGenAIIdea = () => {
  const [show, setShow] = useState(false)
  const [isRandom, setRandom] = useState(false)
  const [value, setValue] = useState('')
  const { pathname, push } = useRouter()
  const { t } = useTranslation()

  const {
    loadingInfo,
    loadingLogo,
    loadingPoster,
    formInfo,
    setInfo,
    setFormInfo,
    setLoadingLogo,
    setLoadingPoster,
    setLoadingInfoDialog,
  } = useAimemeInfoStore()

  const onInputGen = (value: string) => {
    if (loadingInfo || loadingLogo || loadingPoster) {
      toast.warning(t('meme.loading.tip'))
      return
    }
    setShow(true)
    setRandom(false)
    setValue(value)
  }

  const onRandomGen = () => {
    if (loadingInfo || loadingLogo || loadingPoster) {
      toast.warning(t('meme.loading.tip'))
      return
    }

    setShow(true)
    setRandom(true)
  }

  const onConfirm = () => {
    setShow(false)
    setRandom(false)
    if (!pathname.startsWith(Routes.Create)) {
      push(Routes.Create)
    }

    setInfo({ name: isRandom ? '' : value })
    setLoadingInfoDialog(true)
  }

  const onIdeaConfirm = (data: typeof formInfo) => {
    setShow(false)
    setRandom(false)
    if (!pathname.startsWith(Routes.Create)) {
      push(Routes.Create)
    }

    setFormInfo(data)
    setLoadingLogo(true)
    setLoadingPoster(true)
  }

  const onCancel = () => {
    setShow(false)
    setRandom(false)
  }

  const open = () => setShow(true)

  return {
    show,
    value,
    isRandom,
    onCancel,
    onConfirm,
    onIdeaConfirm,
    onInputGen,
    onRandomGen,
    open,
  }
}
