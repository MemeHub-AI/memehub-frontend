import { type ReactNode, useEffect } from 'react'
import { useRouter } from 'next/router'

import { Routes } from '@/routes'
import { IdeaCardSkeleton } from './components/idea-card/skeleton'
import { PrimaryLayout } from '@/components/layouts/primary'
import { MemexTabs } from './components/memex-tabs'

export const getMemexLayout = (page: ReactNode) => (
  <PrimaryLayout
    disablePadding
    contentClass="flex justify-center"
    newsAsideClass="lg:block"
  >
    <MemexTabs>{page}</MemexTabs>
  </PrimaryLayout>
)

export const MemexPage = () => {
  const router = useRouter()

  useEffect(() => {
    router.push(Routes.MemexLatest)
  }, [])

  return <IdeaCardSkeleton />
}

MemexPage.getLayout = getMemexLayout

export default MemexPage
