import React, { useState } from 'react'

import { Main } from './components/main'
import { CreateTokenStatusDialog } from './components/dialog'
import { useDeployV1 } from './hooks/use-deploy-v1'
import { useCreateTokenForm } from './hooks/use-form'
import { OpportunityMoonshot } from '@/components/opportunity-moonshot'
import { CreateTokenContext } from './context'
import { AICreateMemecoinDialogLoading } from '@/components/ai-create-memecoin-dialog/loading'
import { PrimaryLayout } from '@/components/layouts/primary'

export const CreatePage = () => {
  const deployResult = useDeployV1()
  const [tab, setTab] = useState(0)
  const formData = useCreateTokenForm(deployResult)

  return (
    <CreateTokenContext.Provider
      value={{
        formData,
        deployResult,
      }}
    >
      <PrimaryLayout>
        <Main
          className="flex-1 pb-5 max-md:order-1 max-md:border-l-0 max-md:ml-0 max-md:pl-0"
          tab={tab}
          setTab={setTab}
        />

        {/* All status dialog during create. */}
        <CreateTokenStatusDialog {...deployResult} />
      </PrimaryLayout>
      <AICreateMemecoinDialogLoading
        formHook={formData}
      ></AICreateMemecoinDialogLoading>
    </CreateTokenContext.Provider>
  )
}

export default CreatePage
