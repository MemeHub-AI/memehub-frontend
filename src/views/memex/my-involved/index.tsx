import React from 'react'

import { MemexLayout } from '../components/memex-layout'
import { useInvolvedList } from './hooks/use-involved-list'
import { CustomSuspense } from '@/components/custom-suspense'
import { MemexPost } from '../components/memex-post'
import { TweetEmpty } from '../components/tweet-empty'
import { TweetSkeleton } from '../components/tweet-skeleton'

export const MyInvolved = () => {
  const { list, total, isLoading, fetchNextPage } = useInvolvedList()

  return (
    <MemexLayout>
      <CustomSuspense
        isPending={isLoading}
        fallback={<TweetSkeleton />}
        nullback={<TweetEmpty />}
      >
        {list.map((t) => (
          <MemexPost key={t?.hash} post={t} />
        ))}
      </CustomSuspense>
    </MemexLayout>
  )
}

export default MyInvolved
