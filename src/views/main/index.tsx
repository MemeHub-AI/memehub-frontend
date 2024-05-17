import React from 'react'
import { useRouter } from 'next/router'

import { Button } from '@/components/ui/button'
import { Routes } from '@/routes'
import { TokenSearch } from '../../components/token-search'
import { TokenCards } from '@/components/token-cards'
import { HotNewsAside } from './components/aside'

export const MainPage = () => {
  const router = useRouter()

  return (
    <main className="min-h-main px-6 py-3 flex max-sm:px-3 max-sm:pt-0 gap-4">
      <HotNewsAside />
      <div className="flex-1 max-sm:mt-2">
        <TokenCards />
      </div>
    </main>
  )
}

export default MainPage
