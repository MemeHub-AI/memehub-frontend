import { MemexLayout } from '../components/memex-layout'
import { TokenCards } from '@/components/token-cards'
import { useTokens } from '@/hooks/use-tokens'

export const MemexDetailsCoin = () => {
  const {
    tokens,
    idoTokens,
    totalToken,
    isLoading,
    isFetching,
    fetchNextPage,
  } = useTokens()

  return (
    <MemexLayout>
      <TokenCards
        className="flex-1 max-sm:mt-2 flex flex-col pb-4 !h-[calc(100vh-64px-1rem)] overflow-auto px-6 mt-4"
        idoTokens={idoTokens}
        cards={tokens}
        total={totalToken}
        isLoading={isLoading}
        isPending={isFetching}
        onFetchNext={fetchNextPage}
      />
    </MemexLayout>
  )
}

export default MemexDetailsCoin
