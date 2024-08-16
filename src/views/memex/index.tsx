import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

import { MemexLayout } from './components/memex-layout'
import { Routes } from '@/routes'
import { IdeaCardSkeleton } from './components/idea-card-skeleton'

export const MemexPage = () => {
  const router = useRouter()

  useEffect(() => {
    router.push(Routes.MemexLatest)
  }, [])

  return (
    <MemexLayout>
      <IdeaCardSkeleton />
    </MemexLayout>
  )
}

export default MemexPage
