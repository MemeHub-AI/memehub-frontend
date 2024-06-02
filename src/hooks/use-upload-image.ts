import React, { useState } from 'react'
import { first } from 'lodash'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import { otherApi } from '@/api/other'
import { useStorage } from './use-storage'

interface Options {
  onSuccess?: (url: string) => void
  onError?: (reason: string) => void
  onFinally?: () => void
}

const MAX_KB = 300

export const useUploadImage = (options?: Options) => {
  const { onSuccess, onError, onFinally } = options || {}
  const { t } = useTranslation()
  const [file, setFile] = useState<File | null>(null)
  const { getToken } = useStorage()

  const clearFile = () => setFile(null)

  const { data, mutateAsync } = useMutation({
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
      onSuccess?.(data.image_url)
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
    const formData = new FormData()
    const kbSize = file.size / 1024

    if (kbSize > MAX_KB) {
      toast.error(`${t('upload.large')}: ${MAX_KB}kb`)
      return
    }

    formData.append('avatar', file)
    setFile(file)
    mutateAsync(formData)
  }

  return {
    url: data?.data.image_url ?? '',
    file,
    onChangeUpload,
    clearFile,
  }
}
