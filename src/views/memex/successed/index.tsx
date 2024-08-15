import React from 'react'

import { MemexLayout } from '../components/memex-layout'
import { CustomSuspense } from '@/components/custom-suspense'
import { MemexIdeaCard } from '../components/idea-card'
import { IdeaEmpty } from '../components/idea-empty'
import { IdeaCardSkeleton } from '../components/idea-card-skeleton'
import { useIdeaList } from '../hooks/use-idea-list'
import { MemexListType } from '@/api/memex/types'

export const Successed = () => {
  const { list, total, isError, isLoading, fetchNextPage } = useIdeaList(
    MemexListType.Published
  )

  return (
    <MemexLayout>
      <CustomSuspense
        isPending={isLoading}
        fallback={<IdeaCardSkeleton />}
        nullback={<IdeaEmpty />}
      >
        {list.map((t) => (
          <MemexIdeaCard key={t?.hash} idea={t} />
        ))}
      </CustomSuspense>
    </MemexLayout>
  )
}

export default Successed
