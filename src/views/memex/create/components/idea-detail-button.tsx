import React from 'react'
import { IoNewspaperOutline } from 'react-icons/io5'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

import { Button } from '@/components/ui/button'
import { Routes } from '@/routes'
import { useMemexStore } from '@/stores/use-memex'
import { useCreateIdeaContext } from '@/contexts/memex/create-idea'

export const CreateIdeaDetailButton = () => {
  const { t } = useTranslation()
  const { query, ...router } = useRouter()
  const { form, isCreating } = useCreateIdeaContext()
  const { setIdea } = useMemexStore()

  return (
    <Button
      shadow="none"
      type="button"
      className="px-2 sm:hover:bg-zinc-200"
      disabled={isCreating}
      onClick={() => {
        const values = form.getValues()

        setIdea({ ...values, image_urls: values.pictures })
        router.push({
          pathname: Routes.MemexCreateDetails,
          query: { chain: values.chain },
        })
      }}
    >
      <IoNewspaperOutline size={20} className="mr-1" />
      {t('memex.create.coin-detail')}
    </Button>
  )
}

export default CreateIdeaDetailButton
