import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'
import { Title } from './title'
import { AIIdea } from '@/views/main/components/ai-idea'
import { CreateTokenForm } from './form'
import { MobileQpportunityMoonshot } from '@/components/opportunity-moonshot'
import { CreateTokenContext } from '../context'

interface Props {
  className?: string
  tab: number
  setTab: (tab: number) => void
}

export const Main = (props: Props) => {
  const { className, tab, setTab } = props
  const { t } = useTranslation()

  const { newsListData, aiMemeInfo, formData, deployResult } =
    useContext(CreateTokenContext)

  return (
    <div
      className={cn(
        'w-96 pr-6 max-md:w-[480px] max-sm:w-full max-sm:px-4  max-sm:mb-5',
        className
      )}
    >
      <Title className="w-fit max-sm:mt-3">{t('create.new')}</Title>
      <MobileQpportunityMoonshot
        newsListData={newsListData}
        isDialogLoading={aiMemeInfo?.isLoadingMemeInfo}
        onConfirmDialog={() =>
          aiMemeInfo?.getAIMemeInfo(newsListData?.memeit?.title || '')
        }
        tab={tab}
        setTab={setTab}
      ></MobileQpportunityMoonshot>
      <AIIdea
        className="mt-5 w-fit"
        getAIMemeInfo={aiMemeInfo?.getAIMemeInfo}
        isLoadingMemeInfo={newsListData?.isLoadingMemeInfo}
      ></AIIdea>

      {/* All input/textarea */}
      <CreateTokenForm />
    </div>
  )
}
