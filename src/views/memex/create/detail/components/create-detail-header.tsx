import React from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

import { Button } from '@/components/ui/button'
import { useCreateDetailContext } from '@/contexts/memex/create-detail'

export const CreateDetailHeader = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { isUpdating } = useCreateDetailContext()

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          shadow="none"
          size="icon-sm"
          className="border-none w-fit h-fit -ml-0.5"
          disabled={isUpdating}
          onClick={router.back}
        >
          <Cross2Icon className="w-5 h-5" />
        </Button>
        <span className="font-bold">{t('memex.create-detail.title')}</span>
      </div>
      <Button
        shadow="none"
        size="sm"
        className="rounded-full h-7 bg-black text-white"
        disabled={isUpdating}
      >
        {t('confirm')}
      </Button>
    </div>
  )
}

export default CreateDetailHeader
