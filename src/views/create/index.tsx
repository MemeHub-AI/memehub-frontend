import React, { useState } from 'react'

import { Main } from './components/main'
import { CreateTokenStatusDialog } from './components/dialog'
import { useDeploy } from './hooks/use-deploy'
import { useCreateTokenForm } from './hooks/use-form'
import { OpportunityMoonshot } from '@/components/opportunity-moonshot'
import { CreateTokenContext } from './context'
import { AICreateMemecoinDialogLoading } from '@/components/ai-create-memecoin-dialog/loading'

export const CreatePage = () => {
  const deployResult = useDeploy()
  const [tab, setTab] = useState(0)
  const formData = useCreateTokenForm(deployResult)

  return (
    <CreateTokenContext.Provider
      value={{
        formData,
        deployResult,
      }}
    >
      <main className="min-h-main flex justify-center gap-6 mx-auto max-md:flex-col max-md:items-center max-sm:gap-8">
        <OpportunityMoonshot defalutTab={0} className="max-sm:!hidden" />
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
