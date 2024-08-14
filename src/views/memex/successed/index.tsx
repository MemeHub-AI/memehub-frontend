import React from 'react'

import { MemexLayout } from '../components/memex-layout'
import { CustomSuspense } from '@/components/custom-suspense'
import { MemexPost } from '../components/memex-post'
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
          <MemexPost key={t?.hash} post={t} />
        ))}
      </CustomSuspense>
    </MemexLayout>
  )
}

export default Successed
