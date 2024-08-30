import React from 'react'
import { useRouter } from 'next/router'
import { ArrowLeftIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'

export const IdeaDetailsHeader = () => {
  const router = useRouter()

  return (
    <div className="flex items-center h-fit px-2.5 my-1">
      <Button
        shadow="none"
        variant="hover-circle"
        className="-ml-1.5"
        size="icon"
        onClick={router.back}
      >
        <ArrowLeftIcon className="w-6 h-6" />
      </Button>
      {/* TODO/middle: use logo iamge */}
      <h3 className="ml-2 font-semibold md:text-xl">Idea</h3>
    </div>
  )
}

export default IdeaDetailsHeader
