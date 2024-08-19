import React, { useState } from 'react'

import { CreateTokenMain } from './components/main'
import { CreateTokenStatusDialog } from './components/dialog'
import { useCreateTokenForm } from './hooks/use-form'
import { useNewsList } from '@/hooks/use-news-list'
import { AICreateMemecoinDialogLoading } from '@/components/ai-create-memecoin-dialog/loading'
import { PrimaryLayout } from '@/components/layouts/primary'
import { CreateTokenProvider } from '@/contexts/create-token'

export const CreatePage = () => {
  const [tab, setTab] = useState(0)
  const { deployResult, ...formData } = useCreateTokenForm()
  const newsListData = useNewsList({ isOpportunity: tab === 1 })

  return (
    <CreateTokenProvider
      value={{
        formData,
        deployResult,
        newsListData,
      }}
    >
      <PrimaryLayout>
        <CreateTokenMain
          className="flex-1 pb-5 max-md:order-1 max-md:border-l-0 max-md:ml-0 max-md:pl-0"
          tab={tab}
          setTab={setTab}
        />
        <CreateTokenStatusDialog />
      </PrimaryLayout>
      <AICreateMemecoinDialogLoading />
    </CreateTokenProvider>
  )
}

export default CreatePage
