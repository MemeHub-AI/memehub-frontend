import React from 'react'

import { TokenCards } from '@/components/token-cards'
import { HotNewsAside } from './components/aside'
import { useTokens } from '@/hooks/use-tokens'

export const MainPage = () => {
  const { tokens, totalToken, isLoading, isFetching, fetchNextPage } =
    useTokens()

  return (
    <main className="min-h-main px-6 py-3 flex max-sm:px-3 max-sm:pt-0 gap-6">
      <HotNewsAside />
      <TokenCards
        className="flex-1 max-sm:mt-2 flex flex-col"
        cards={tokens}
        total={totalToken}
        isLoading={isLoading}
        isPending={isFetching}
        onFetchNext={fetchNextPage}
      />
    </main>
  )
}

export default MainPage
