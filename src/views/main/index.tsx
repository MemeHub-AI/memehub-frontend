import React from 'react'
import { useRouter } from 'next/router'

import { Button } from '@/components/ui/button'
import { Routes } from '@/routes'
import { Input } from '../../components/input'
import { TokenCards } from '@/components/token-cards'
import { HotNewsAside } from './components/aside'
import { useTokens } from '@/hooks/use-tokens'
import { AIIdea } from './components/ai-idea'

export const MainPage = () => {
  const router = useRouter()
  const { tokens, isFetching } = useTokens()

  return (
    <main className="min-h-main px-6 pb-3 flex max-sm:px-3 max-sm:pt-0 gap-6">
      <HotNewsAside />
      <div className="flex-1 max-sm:mt-2">
        <AIIdea></AIIdea>
        <TokenCards cards={tokens} isPending={isFetching} />
      </div>
    </main>
  )
}

export default MainPage
