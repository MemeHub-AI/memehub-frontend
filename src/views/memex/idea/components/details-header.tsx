import React from 'react'
import { useRouter } from 'next/router'
import { ArrowLeftIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'
import { useResponsive } from '@/hooks/use-responsive'

export const IdeaDetailsHeader = () => {
  const router = useRouter()
  const { isPad } = useResponsive()

  return (
    <div className="flex items-center h-fit px-2.5 my-1">
      <Button
        shadow="none"
        size={isPad ? 'icon-sm' : 'icon-lg'}
        className="border-0 w-fit items-center"
        onClick={router.back}
      >
        <ArrowLeftIcon className="w-6 h-6" />
      </Button>
      {/* TODO/memex: use logo iamge */}
      <h3 className="ml-6 font-semibold md:text-xl">Memex</h3>
    </div>
  )
}

export default IdeaDetailsHeader
