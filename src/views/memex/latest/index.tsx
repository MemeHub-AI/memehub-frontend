import React from 'react'

import { MemexLayout } from '../components/memex-layout'
import { MemexTweet } from '../components/memex-tweet'
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
          <MemexTweet key={t?.hash} tweet={t} />
        ))}
      </CustomSuspense>
    </MemexLayout>
  )
}

export default Latest
