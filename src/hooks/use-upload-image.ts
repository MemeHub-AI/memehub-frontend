import React, { useState } from 'react'
import { first } from 'lodash'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import { otherApi } from '@/api/other'
import { useLocalStorage } from './use-storage'
import { reportException } from '@/errors'
import { ApiCode } from '@/api/types'

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
  const { getStorage } = useLocalStorage()

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
    onError: (e: Response & Error) => {
      clearFile()
      onError?.(e.message)
      const msg =
        e.status === ApiCode.TooLarge ? t('upload.too-large') : e.message
      toast.error(t('upload.failed') + ' ' + msg)
    },
    onSuccess: ({ data }) => {
      toast.success(t('upload.success'))
      onSuccess?.(data?.image_url)
    },
  })

  const onChangeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Cannot to upload image if not logged in.
    if (!getStorage('token')) {
      e.preventDefault()
      clearFile()
      toast.error(t('login-before'))
      return
    }

    const firstFile = first(e.target.files)!
    if (!firstFile.size) return

    const formData = new FormData()

    formData.append('avatar', firstFile)
    setFile(firstFile)

    try {
      const { data } = await mutateAsync(formData)
      return data.image_url
    } catch (err) {
      reportException(err)
    }
  }

  const clearFile = () => {
    reset()
    if (file) setFile(null)
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
