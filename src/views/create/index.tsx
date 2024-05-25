import React from 'react'

import { CreateTokenForm } from './components/form'
import { InspirationNews } from './components/inspiration-news'

export const CreatePage = () => {
  return (
    <main className="min-h-main flex justify-center gap-20 mx-auto max-md:flex-col max-md:items-center max-sm:gap-8">
      <InspirationNews className="ml-6 max-w-[400px] max-md:order-2 max-md:w-[60vw] max-sm:w-full" />
      <CreateTokenForm className="flex-1 max-md:order-1" />
    </main>
  )
}

export default CreatePage
