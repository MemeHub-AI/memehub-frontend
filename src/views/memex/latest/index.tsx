import React from 'react'

import { MemexLayout } from '../components/memex-layout'
import { MemexIdeaCard } from '../components/idea-card'
import { CustomSuspense } from '@/components/custom-suspense'
import { IdeaEmpty } from '../components/idea-empty'
import { IdeaCardSkeleton } from '../components/idea-card-skeleton'
import { MemexListType } from '@/api/memex/types'
import { useIdeaList } from '../hooks/use-idea-list'

export const Latest = () => {
  const { list, total, isLoading, refetch, fetchNextPage } = useIdeaList(
    MemexListType.Latest
  )

  return (
    <MemexLayout>
      <CustomSuspense
        isPending={isLoading}
        fallback={<IdeaCardSkeleton />}
        nullback={<IdeaEmpty />}
      >
        {list.map((t) => (
          <MemexIdeaCard key={t?.hash} idea={t} onCommentSuccess={refetch} />
        ))}
      </CustomSuspense>
    </MemexLayout>
  )
}

export default Latest
