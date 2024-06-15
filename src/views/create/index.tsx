import React, { useState } from 'react'

import { CreateTokenMain } from './components/main'
import { CreateTokenStatusDialog } from './components/dialog'
import { useDeployV1 } from './hooks/use-deploy-v1'
import { useCreateTokenForm } from './hooks/use-form'
import { useNewsList } from '@/hooks/use-news-list'
import { useAIMemeInfo } from '@/hooks/use-ai-meme-info'
import { OpportunityMoonshot } from '@/components/opportunity-moonshot'
import { AICreateMemecoinDialogLoading } from '@/components/ai-create-memecoin-dialog/loading'
import { PrimaryLayout } from '@/components/layouts/primary'
import { useDeployV2 } from './hooks/use-deploy-v2'
import { CreateTokenProvider } from '@/contexts/create-token'

export const CreatePage = () => {
  // const deployResult = useDeployV1()
  const deployResult = useDeployV2()
  const [tab, setTab] = useState(0)
  const formData = useCreateTokenForm(deployResult)

  const aiMemeInfo = useAIMemeInfo({ form: formData.form })
  const newsListData = useNewsList({ isOpportunity: tab === 1 })

  return (
    <CreateTokenProvider
      value={{
        formData,
        deployResult,
        newsListData,
        aiMemeInfo,
      }}
    >
      <PrimaryLayout>
        <CreateTokenMain
          className="flex-1 pb-5 max-md:order-1 max-md:border-l-0 max-md:ml-0 max-md:pl-0"
          tab={tab}
          setTab={setTab}
        />

        {/* All status dialog during create. */}
        <CreateTokenStatusDialog />
      </PrimaryLayout>
      <AICreateMemecoinDialogLoading
        formHook={formData}
      ></AICreateMemecoinDialogLoading>
    </CreateTokenProvider>
  )
}

export default CreatePage
