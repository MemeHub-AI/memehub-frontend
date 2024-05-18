import React, { useState } from 'react'
import { first } from 'lodash'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import type { ApiResponse } from '@/api'

import { otherApi } from '@/api/other'

export const useUploadImage = () => {
  const { t } = useTranslation()
  const [url, setUrl] = useState('')

  const { mutateAsync } = useMutation({
    mutationKey: [otherApi.uploadImage.name],
    mutationFn: otherApi.uploadImage,
  })

  const onChangeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = first(e.target.files)!
    const formData = new FormData()
    formData.append('avatar', file)

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

      toast.success(t('upload.success'))
      setUrl(data.image_url)
    } catch (error) {
      console.error(error)
      toast.success(t('upload.failed'))
    } finally {
      toast.dismiss(id)
    }
  }

  return {
    url,
    onChangeUpload,
  }
}
