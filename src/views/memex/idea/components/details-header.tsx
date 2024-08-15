import React from 'react'
import { useRouter } from 'next/router'
import { ArrowLeftIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'

export const IdeaDetailsHeader = () => {
  const router = useRouter()

  return (
    <div className="flex items-center h-fit px-2 my-1">
      <Button
        shadow="none"
        size="icon-sm"
        className="border-0 w-fit items-center"
        onClick={router.back}
      >
        <ArrowLeftIcon className="w-6 h-6" />
      </Button>
      {/* TODO/memex: use logo iamge */}
      <h3 className="ml-6 font-semibold">Memex</h3>
    </div>
  )
}

export default IdeaDetailsHeader
