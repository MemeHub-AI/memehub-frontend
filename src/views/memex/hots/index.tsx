import React from 'react'

import { MemexLayout } from '../components/memex-layout'
import { CustomSuspense } from '@/components/custom-suspense'
import { MemexIdeaCard } from '../components/idea-card'
import { IdeaEmpty } from '../components/idea-empty'
import { IdeaCardSkeleton } from '../components/idea-card-skeleton'
import { useIdeaList } from '../hooks/use-idea-list'
import { MemexListType } from '@/api/memex/types'

export const Hots = () => {
  const { list, total, isLoading, fetchNextPage } = useIdeaList(
    MemexListType.Hot
  )

  return (
    <MemexLayout>
      <CustomSuspense
        isPending={isLoading}
        fallback={<IdeaCardSkeleton />}
        nullback={<IdeaEmpty />}
      >
        {list.map((idea) => (
          <MemexIdeaCard key={idea?.hash} idea={idea} />
        ))}
      </CustomSuspense>
    </MemexLayout>
  )
}

export default Hots
