import React from 'react'

import { TokenCards } from '@/components/token-cards'
import { useTokens } from '@/hooks/use-tokens'
import { AIIdeaBar } from '@/components/ai-idea-bar'
import { AICreateMemecoinDialog } from '@/components/ai-create-memecoin-dialog'
import { useGenAIIdea } from '@/hooks/use-gen-ai-idea'
import { PrimaryLayout } from '@/components/layouts/primary'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranslation } from 'react-i18next'
import { IdoCards } from './components/ido-cards'

export const MainPage = () => {
  const { tokens, totalToken, isLoading, isFetching, fetchNextPage } =
    useTokens()
  const { t } = useTranslation()

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
        <Tabs defaultValue="ido">
          <TabsList>
            <TabsTrigger value="ido">{t('ido')}</TabsTrigger>
            <TabsTrigger value="token">{t('token')}</TabsTrigger>
          </TabsList>
          <TabsContent value={'ido'}>
            <IdoCards></IdoCards>
          </TabsContent>
          <TabsContent value={'token'}>
            <TokenCards
              className="flex-1 max-sm:mt-2 flex flex-col pb-4"
              cards={tokens}
              total={totalToken}
              isLoading={isLoading}
              isPending={isFetching}
              onFetchNext={fetchNextPage}
            />
          </TabsContent>
        </Tabs>
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
