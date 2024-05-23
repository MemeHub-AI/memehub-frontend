import React, { useState } from 'react'
import { first } from 'lodash'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import type { ApiResponse } from '@/api'

import { otherApi } from '@/api/other'

interface Options {
  onSuccess?: (url: string) => void
  onErrror?: (reason: string) => void
  onFinally?: () => void
}

export const useUploadImage = (options?: Options) => {
  const { onSuccess, onErrror, onFinally } = options || {}
  const { t } = useTranslation()
  const [url, setUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const { mutateAsync } = useMutation({
    mutationKey: [otherApi.uploadImage.name],
    mutationFn: otherApi.uploadImage,
  })

  const clearFile = () => setFile(null)

  const onChangeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = first(e.target.files)!
    const formData = new FormData()

    formData.append('avatar', file)
    setFile(file)

    const id = toast.loading(t('uploading'))
    try {
      const response = await fetch('https://api.memehub.ai/api/v1/upload/', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        console.error('Failed to upload image')
        return
      }

      const { data } = (await response.json()) as ApiResponse<{
        image_url: string
      }>

      setUrl(data.image_url)
      onSuccess?.(data.image_url)
      toast.success(t('upload.success'))
    } catch (error) {
      console.error(error)
      clearFile()
      onErrror?.(String(error))
      toast.success(t('upload.failed'))
    } finally {
      toast.dismiss(id)
      onFinally?.()
    }
  }

  return {
    url,
    file,
    onChangeUpload,
    clearFile,
  }
}
