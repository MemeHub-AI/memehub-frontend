import React from 'react'

import { TokenCards } from '@/components/token-cards'
import { useTokens } from '@/hooks/use-tokens'
import { AIIdeaBar } from '@/components/ai-idea-bar'
import { AICreateMemecoinDialog } from '@/components/ai-create-memecoin-dialog'
import { useGenAIIdea } from '@/hooks/use-gen-ai-idea'
import { PrimaryLayout } from '@/components/layouts/primary'

export const MainPage = () => {
  const { tokens, totalToken, isLoading, isFetching, fetchNextPage } =
    useTokens()

  const {
    isRandom,
    show,
    value,
    onCancel,
    onConfirm,
    onInputGen,
    onRandomGen,
  } = useGenAIIdea()

  return (
    <PrimaryLayout>
      <div className="flex-1 max-sm:mt-2">
        <AIIdeaBar
          className="max-sm:mb-3"
          onInputGen={onInputGen}
          onRandomGen={onRandomGen}
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
          show={show}
          isRandom={isRandom}
          data={{ name: value }}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      </div>
    </PrimaryLayout>
  )
}

export default MainPage
