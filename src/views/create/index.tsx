import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CreateTokenStatusDialog } from './components/dialog'
import { useCreateTokenForm } from './hooks/use-form'
import { useNewsList } from '@/hooks/use-news-list'
import { AICreateMemecoinDialogLoading } from '@/components/ai-create-memecoin-dialog/loading'
import { PrimaryLayout } from '@/components/layouts/primary'
import { CreateTokenProvider } from '@/contexts/create-token'
import { cn } from '@/lib/utils'
import { CreateTokenTitle } from './components/title'
import { MobileQpportunityMoonshot } from '@/components/opportunity-moonshot'
import { useGenAIIdea } from '@/hooks/use-gen-ai-idea'
import { AIIdeaBar } from '@/components/ai-idea-bar'
import { AICreateMemecoinDialog } from '@/components/ai-create-memecoin-dialog'
import { CreateTokenForm } from './components/form/form'

export const CreatePage = () => {
  const { t } = useTranslation()
  const [tab, setTab] = useState(0)
  const deployResults = useCreateTokenForm()
  const newsListData = useNewsList({ isOpportunity: tab === 1 })
  const {
    show,
    isRandom,
    value,
    onInputGen,
    onRandomGen,
    onCancel,
    onConfirm,
  } = useGenAIIdea()

  return (
    <CreateTokenProvider
      value={{
        ...deployResults,
        ...newsListData,
      }}
    >
      <PrimaryLayout>
        <div
          className={cn(
            'flex-1 pb-5 max-md:order-1 max-md:border-l-0 max-md:ml-0 max-md:pl-0',
            'w-96 pr-6 max-md:w-[480px] max-sm:w-full max-sm:px-0'
          )}
        >
          <CreateTokenTitle className="w-fit max-sm:mt-3">
            {t('create.new')}
          </CreateTokenTitle>

          <div className="sm:hidden">
            <MobileQpportunityMoonshot defalutTab={1} />
          </div>

          <AIIdeaBar
            className="mt-5 w-fit"
            onInputGen={onInputGen}
            onRandomGen={onRandomGen}
          />

          <AICreateMemecoinDialog
            show={show}
            data={{ name: value }}
            isRandom={isRandom}
            onConfirm={onConfirm}
            onCancel={onCancel}
          />

          <CreateTokenForm />
        </div>

        <CreateTokenStatusDialog />
      </PrimaryLayout>
      <AICreateMemecoinDialogLoading />
    </CreateTokenProvider>
  )
}

export default CreatePage
