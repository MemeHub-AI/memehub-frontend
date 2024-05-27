import React from 'react'

import { Main } from './components/main'
import { InspirationNews } from './components/aside'
import { CreateTokenStatusDialog } from './components/dialog'
import { useDeploy } from './hooks/use-deploy'
import { useCreateTokenForm } from './hooks/use-form'
import { useNewsList } from '@/hooks/use-news-list'
import { useAIMemeInfo } from '@/hooks/use-ai-meme-info'

export const CreatePage = () => {
  const deployResult = useDeploy()
  const formData = useCreateTokenForm(deployResult)
  const newsListData = useNewsList({ formData })

  const aIMemeInfo = useAIMemeInfo({ form: formData.form })

  return (
    <main className="min-h-main flex justify-center mx-auto max-md:flex-col max-md:items-center max-sm:gap-8">
      <InspirationNews
        className="ml-6 w-aside max-md:ml-0 max-md:px-4 max-md:order-2 max-md:w-[480px] max-sm:w-full"
        newsListData={newsListData}
        aIMemeInfo={aIMemeInfo}
      />
      <Main
        newsListData={newsListData}
        deployResult={deployResult}
        formData={formData}
        aIMemeInfo={aIMemeInfo}
        className="flex-1 ml-10 pl-10 max-md:order-1  border-l max-md:border-l-0 max-md:ml-0 max-md:pl-0"
      />

      {/* All status dialog during create. */}
      <CreateTokenStatusDialog {...deployResult} />
    </main>
  )
}

export default CreatePage
