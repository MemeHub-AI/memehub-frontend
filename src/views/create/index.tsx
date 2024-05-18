import React from 'react'
import { ChevronLeftIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/router'

import { CreateTokenForm } from './components/form'
import { Button } from '@/components/ui/button'
import { useResponsive } from '@/hooks/use-responsive'
import { InspirationNews } from './components/inspiration-news'

export const CreatePage = () => {
  const router = useRouter()
  const { isMobile } = useResponsive()

  const Back = (
    <Button
      size="icon"
      variant={isMobile ? 'outline' : 'ghost'}
      className="absolute left-0 max-sm:left-3"
      onClick={router.back}
    >
      <ChevronLeftIcon />
    </Button>
  )
  return (
    <main className="min-h-main flex justify-center gap-20 max-w-[90vw] mx-auto max-md:flex-col max-md:items-center">
      <InspirationNews className="w-[29vw] max-md:order-2 max-md:w-[60vw] max-sm:w-full" />
      <CreateTokenForm className="flex-1 max-md:order-" />
    </main>
  )
}

export default CreatePage
