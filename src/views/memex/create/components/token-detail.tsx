import React from 'react'
import { IoNewspaperOutline } from 'react-icons/io5'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

import { Button } from '@/components/ui/button'
import { Routes } from '@/routes'
import { useMemexStore } from '@/stores/use-memex'
import { useCreatePostContext } from '@/contexts/memex/create-post'

export const CreateTokenDetail = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { form, isCreating } = useCreatePostContext()
  const { setPost } = useMemexStore()

  return (
    <Button
      shadow="none"
      type="button"
      className="px-2"
      disabled={isCreating}
      onClick={() => {
        const values = form.getValues()

        setPost({ ...values, image_urls: values.pictures })
        router.push(Routes.MemexCreateDetail)
      }}
    >
      <IoNewspaperOutline size={20} className="mr-1" />
      {t('memex.create.coin-detail')}
    </Button>
  )
}

export default CreateTokenDetail
