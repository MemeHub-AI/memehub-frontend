import React from 'react'
import { useRouter } from 'next/router'

import { Button } from '@/components/ui/button'
import { Routes } from '@/routes'
import { useResponsive } from '@/hooks/use-responsive'
import { cn } from '@/lib/utils'

export const IdeaFloatButton = () => {
  const router = useRouter()
  const { isPad } = useResponsive()

  return (
    <Button
      variant="purple"
      size="icon-2xl"
      shadow="none"
      className={cn(
        'rounded-full shadow-lg shadow-black',
        isPad && 'fixed bottom-4 right-2 p-3.5',
        !isPad && 'p-2 w-12 h-12'
      )}
      onClick={() => router.push(Routes.MemexCreate)}
    >
      <img src="/icons/writer.svg" alt="writer" className="w-full h-full" />
    </Button>
  )
}

export default IdeaFloatButton
