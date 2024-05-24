import React, { useState } from 'react'
import { first, isEmpty } from 'lodash'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import type { ApiResponse } from '@/api/types'

import { otherApi } from '@/api/other'
import { useStorage } from './use-storage'

interface Options {
  onSuccess?: (url: string) => void
  onErrror?: (reason: string) => void
  onFinally?: () => void
}

const MAX_KB = 300

export const useUploadImage = (options?: Options) => {
  const { onSuccess, onErrror, onFinally } = options || {}
  const { t } = useTranslation()
  const [url, setUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const { getToken } = useStorage()

  const { mutateAsync } = useMutation({
    mutationKey: [otherApi.uploadImage.name],
    mutationFn: otherApi.uploadImage,
  })

  const clearFile = () => setFile(null)

  const onChangeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = first(e.target.files)!
    const formData = new FormData()
    const kbSize = file.size / 1024

    if (kbSize > MAX_KB) {
      toast.error(`${t('upload.large')}: ${MAX_KB}kb`)
      return
    }

    formData.append('avatar', file)
    setFile(file)

    const id = toast.loading(t('uploading'))
    try {
      const headers = new Headers()
      const token = getToken() || ''
      if (!isEmpty(token)) {
        headers.append('Authorization', `Bearer ${token}`)
      }
      const response = await fetch('https://api.memehub.ai/api/v1/upload/', {
        method: 'POST',
        body: formData,
        headers,
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
