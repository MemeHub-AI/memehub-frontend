import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import { otherApi } from '@/api/other'
import { UPLOAD_ERR } from '@/errors/upload'

interface Options {
  onSuccess?: (urls: string[] | undefined) => void
  onError?: (reason: string) => void
  onFinally?: () => void
}

const uploadImages = async (files: File[]) => {
  const res = []
  for (let f of files) {
    const formData = new FormData()
    if (!f.size) return

    formData.append('avatar', f)
    const response = await otherApi.uploadImage(formData)

    res.push(response.data.image_url)
  }

  return res
}

export const useUploadImages = (options?: Options) => {
  const { onSuccess, onError, onFinally } = options || {}
  const { t } = useTranslation()

  const {
    data,
    isPending: isUploading,
    mutateAsync,
    reset,
  } = useMutation({
    mutationKey: ['uploadImages'],
    mutationFn: uploadImages,
    onMutate: () => toast.loading(t('uploading')),
    onSettled: (_, __, ___, id) => {
      toast.dismiss(id)
      onFinally?.()
    },
    onError: ({ message }) => {
      UPLOAD_ERR.message(message)
      onError?.(message)
    },
    onSuccess: (urls) => {
      toast.success(t('upload.success'))
      onSuccess?.(urls)
    },
  })

  return {
    urls: data ?? [],
    onUploadImages: mutateAsync,
    isUploading,
    reset,
  }
}
