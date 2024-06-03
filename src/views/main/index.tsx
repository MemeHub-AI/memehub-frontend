import React from 'react'

import { TokenCards } from '@/components/token-cards'
import { HotNewsAside } from '../../components/aside'
import { useTokens } from '@/hooks/use-tokens'
import { AIIdea } from './components/ai-idea'
import { useTradeLogs } from '@/hooks/use-trade-logs'

export const MainPage = () => {
  const { tokens, totalToken, isLoading, isFetching, fetchNextPage } =
    useTokens()

  useTradeLogs()

  return (
    <main className="min-h-main px-6 flex max-sm:px-3 max-sm:pt-0 gap-6">
      <HotNewsAside />
      <div className="flex-1 max-sm:mt-2">
        <AIIdea className="max-sm:mb-3" />
        <TokenCards
          className="flex-1 max-sm:mt-2 flex flex-col pb-4"
          cards={tokens}
          total={totalToken}
          isLoading={isLoading}
          isPending={isFetching}
          onFetchNext={fetchNextPage}
        />
      </div>
    </main>
  )
}

export default MainPage
