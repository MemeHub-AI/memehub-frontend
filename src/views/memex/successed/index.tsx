import React from 'react'

import { MemexLayout } from '../components/memex-layout'
import { CustomSuspense } from '@/components/custom-suspense'
import { MemexTweet } from '../components/memex-tweet'
import { useSuccessedList } from './hooks/use-successed-list'
import { TweetEmpty } from '../components/tweet-empty'
import { TweetSkeleton } from '../components/tweet-skeleton'

export const Successed = () => {
  const { list, total, isError, isLoading, fetchNextPage } = useSuccessedList()

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

export default Successed
