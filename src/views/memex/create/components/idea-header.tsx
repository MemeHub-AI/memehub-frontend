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
  const router = useRouter()
  const {
    form: { formState, ...form },
    isCreating,
    deployFee,
  } = useCreateIdeaContext()
  const { chain } = useChainInfo(form.getValues('chain'))

  const hasError = !isEmpty(Object.keys(formState.errors))
  const publishFee = BigNumber(deployFee).gt(0)
    ? `(${deployFee} ${chain?.native.symbol})`
    : ''

  return (
    <div className="flex items-center justify-between space-x-2 mx-1">
      <div className="flex items-center space-x-1">
        <Button
          shadow="none"
          size="icon-sm"
          className="border-none rounded-full"
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
        disabled={hasError || isCreating}
      >
        {isCreating
          ? t('memex.creating')
          : `${t('memex.create')} ${publishFee}`}
      </Button>
    </div>
  )
}

export default CreateIdeaHeader
