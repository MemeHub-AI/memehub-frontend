import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

import { MemexLayout } from './components/memex-layout'
import { Routes } from '@/routes'

export const MemexPage = () => {
  const router = useRouter()

  useEffect(() => {
    router.push(Routes.MemexLatest)
  }, [])

  return (
    <MemexLayout>
      <p>No yet</p>
    </MemexLayout>
  )
}

export default MemexPage
