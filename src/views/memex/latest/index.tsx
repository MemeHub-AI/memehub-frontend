import React from 'react'

import { MemexLayout } from '../components/memex-layout'
import { MemexPost } from '../components/memex-post'
import { useLatestList } from './hooks/use-latest-list'
import { CustomSuspense } from '@/components/custom-suspense'
import { TweetEmpty } from '../components/tweet-empty'
import { TweetSkeleton } from '../components/tweet-skeleton'

export const Latest = () => {
  const { list, total, isLoading, fetchNextPage } = useLatestList()

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

export default Latest
