import React, { useState } from 'react'
import { first } from 'lodash'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import { otherApi } from '@/api/other'
import { useStorage } from './use-storage'
import { UPLOAD_ERR } from '@/errors/upload'

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
    onError: ({ message }) => {
      UPLOAD_ERR.message(message)
      onError?.(message)
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
    console.log(file)

    if (!file.size) return

    const formData = new FormData()

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
