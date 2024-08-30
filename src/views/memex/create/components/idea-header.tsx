import React from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { ChevronLeftIcon } from '@radix-ui/react-icons'
import { isEmpty } from 'lodash'
import { BigNumber } from 'bignumber.js'

import { Button } from '@/components/ui/button'
import { useCreateIdeaContext } from '@/contexts/memex/create-idea'
import { useChainInfo } from '@/hooks/use-chain-info'

export const CreateIdeaHeader = () => {
  const { t } = useTranslation()
  const { query, ...router } = useRouter()
  const {
    form: { formState, ...form },
    isCreating,
    deployFee,
  } = useCreateIdeaContext()
  const { chain } = useChainInfo(form.getValues('chain'))

  const isUpdate = typeof query.hash === 'string'
  const hasError = !isEmpty(Object.keys(formState.errors))
  const isValidFee = BigNumber(deployFee).gt(0)
  const publishFee = isValidFee ? `(${deployFee} ${chain?.native.symbol})` : ''

  const disabled = hasError || isCreating || !isValidFee

  const renderButtonText = () => {
    if (!isValidFee) return t('deploy.unsupport.chain')
    if (isCreating) return t('memex.creating')
    if (isUpdate) return t('update')

    return `${t('memex.create')} ${publishFee}`
  }

  return (
    <div className="flex items-center justify-between space-x-2 mx-1">
      <div className="flex items-center space-x-1">
        <Button
          variant="hover-circle"
          shadow="none"
          type="button"
          disabled={isCreating}
          onClick={router.back}
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </Button>
        <span className="font-bold line-clamp-1">
          {t('memex.create.title')}
        </span>
      </div>
      <Button
        shadow="none"
        size="sm"
        className="rounded-full bg-yellow-600 border-none text-white h-7 !mr-1.5"
        type="submit"
        disabled={disabled}
      >
        {renderButtonText()}
      </Button>
    </div>
  )
}

export default CreateIdeaHeader
