import { Cross2Icon } from '@radix-ui/react-icons'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { isEmpty } from 'lodash'

import { Button } from '@/components/ui/button'
import { useCreateIdeaDetailsContext } from '@/contexts/memex/create-idea-detail'

export const CreateIdeaDetailsHeader = () => {
  const { t } = useTranslation()
  const { query, ...router } = useRouter()
  const { isUpdating, form } = useCreateIdeaDetailsContext()
  const isUpdate = typeof query.hash === 'string'
  const disabled = isUpdating || !isEmpty(form.formState.errors)

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
        disabled={disabled}
      >
        {isUpdate ? t('update') : t('confirm')}
      </Button>
    </div>
  )
}

export default CreateIdeaDetailsHeader
