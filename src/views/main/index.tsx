import React from 'react'

import { TokenCards } from '@/components/token-cards'
import { HotNewsAside } from '../../components/aside'
import { useTokens } from '@/hooks/use-tokens'
import { AIIdeaBar } from '@/components/ai-idea'
import { useTradeLogs } from '@/hooks/use-trade-logs'
import { AICreateMemecoinDialog } from '@/components/ai-create-memecoin-dialog'
import { useGenAIIdea } from '@/hooks/use-gen-ai-idea'

export const MainPage = () => {
  const { tokens, totalToken, isLoading, isFetching, fetchNextPage } =
    useTokens()

  const { onCancel, onConfirm, onInputGen, onRandomGen } = useGenAIIdea()

  return (
    <main className="min-h-main px-6 flex max-sm:px-3 max-sm:pt-0 gap-6">
      <HotNewsAside />
      <div className="flex-1 max-sm:mt-2">
        <AIIdeaBar
          className="max-sm:mb-3"
          onInputGen={function (value: string): void {
            throw new Error('Function not implemented.')
          }}
          onRandomGen={function (): void {
            throw new Error('Function not implemented.')
          }}
        />
        <TokenCards
          className="flex-1 max-sm:mt-2 flex flex-col pb-4"
          cards={tokens}
          total={totalToken}
          isLoading={isLoading}
          isPending={isFetching}
          onFetchNext={fetchNextPage}
        />

        <AICreateMemecoinDialog
          onCancel={function (): void {
            throw new Error('Function not implemented.')
          }}
          onConfirm={function () {
            throw new Error('Function not implemented.')
          }}
        />
      </div>
    </main>
  )
}

export default MainPage
