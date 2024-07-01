import React, { useState } from 'react'
import { first } from 'lodash'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import { otherApi } from '@/api/other'
import { useStorage } from './use-storage'
import { MAX_IMAGE_MB } from '@/constants/upload'

interface Options {
  inputEl?: HTMLInputElement | null
  onSuccess?: (url: string) => void
  onError?: (reason: string) => void
  onFinally?: () => void
}

export const useUploadImage = (options?: Options) => {
  const { inputEl, onSuccess, onError, onFinally } = options || {}
  const { t } = useTranslation()
  const [file, setFile] = useState<File | null>(null)
  const { getToken } = useStorage()

  const {
    data,
    isPending: isUploading,
    mutateAsync,
    reset,
  } = useMutation({
    mutationKey: [otherApi.uploadImage.name],
    mutationFn: otherApi.uploadImage,
    onMutate: () => toast.loading(t('uploading')),
    onSettled: (_, __, ___, id) => {
      toast.dismiss(id)
      onFinally?.()
    },
    onError: (e) => {
      toast.error(t('upload.failed'))
      onError?.(e.message)
      clearFile()
    },
    onSuccess: ({ data }) => {
      toast.success(t('upload.success'))
      onSuccess?.(data?.image_url)
    },
  })

  const onChangeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Cannot to upload image if not logged in.
    if (!getToken()) {
      e.preventDefault()
      toast.error(t('login-before'))
      return
    }

    const file = first(e.target.files)!

    if (!file.size) {
      return
    }

    const formData = new FormData()
    const mb = file.size / 1024 / 1024

    if (mb > MAX_IMAGE_MB) {
      toast.error(`${t('upload.large')}: ${MAX_IMAGE_MB} mb`)
      return
    }

    formData.append('avatar', file)
    setFile(file)
    mutateAsync(formData)
  }

  const clearFile = () => {
    setFile(null)
    reset()
    if (inputEl) inputEl.value = ''
  }

  return {
    url: data?.data?.image_url ?? '',
    file,
    isUploading,
    onChangeUpload,
    clearFile,
  }
}
