import React, { useEffect, useRef, useState } from 'react'

import { Main } from './components/main'
import { CreateTokenStatusDialog } from './components/dialog'
import { useDeployV1 } from './hooks/use-deploy-v1'
import { useCreateTokenForm } from './hooks/use-form'
import { useNewsList } from '@/hooks/use-news-list'
import { useAIMemeInfo } from '@/hooks/use-ai-meme-info'
import { OpportunityMoonshot } from '@/components/opportunity-moonshot'
import { CreateTokenContext } from './context'
import { AICreateMemecoinDialogLoading } from '@/components/ai-create-memecoin-dialog/loading'
import { useDeployV2 } from './hooks/use-deploy-v2'

export const CreatePage = () => {
  const deployResult = useDeployV1()
  // const deployResult = useDeployV2()
  const [tab, setTab] = useState(0)
  const formData = useCreateTokenForm(deployResult)

  const aiMemeInfo = useAIMemeInfo({ form: formData.form })
  const newsListData = useNewsList({ isOpportunity: tab === 1 })

  return (
    <CreateTokenContext.Provider
      value={{
        formData,
        deployResult,
        newsListData,
        aiMemeInfo,
      }}
    >
      <main className="min-h-main flex justify-center gap-6 mx-auto max-md:flex-col max-md:items-center max-sm:gap-8">
        <OpportunityMoonshot
          className="max-sm:!hidden"
          newsListData={newsListData}
          isDialogLoading={aiMemeInfo.isLoadingMemeInfo}
          onConfirmDialog={() =>
            aiMemeInfo.getAIMemeInfo(newsListData.memeit?.title || '')
          }
          tab={tab}
          setTab={setTab}
        />
        <Main
          className="flex-1 pb-5 max-md:order-1 max-md:border-l-0 max-md:ml-0 max-md:pl-0"
          tab={tab}
          setTab={setTab}
        />

        {/* All status dialog during create. */}
        <CreateTokenStatusDialog {...deployResult} />
      </main>
      <AICreateMemecoinDialogLoading
        formHook={formData}
      ></AICreateMemecoinDialogLoading>
    </CreateTokenContext.Provider>
  )
}

export default CreatePage
