import React from 'react'
import { useRouter } from 'next/router'

import { Button } from '@/components/ui/button'
import { Routes } from '@/routes'

export const CreateButton = () => {
  const router = useRouter()

  return (
    <Button
      variant="purple"
      size="icon-2xl"
      shadow="none"
      className="rounded-full p-3.5 fixed bottom-4 right-2 shadow-md !shadow-zinc-500"
      onClick={() => router.push(Routes.MemexCreate)}
    >
      <img src="/icons/writer.svg" alt="writer" className="w-full h-full" />
    </Button>
  )
}

export default CreateButton
