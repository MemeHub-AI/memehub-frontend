import React from 'react'

import { MemexLayout } from '../components/memex-layout'
import { MemexPost } from '../components/memex-post'
import { CustomSuspense } from '@/components/custom-suspense'
import { PostEmpty } from '../components/post-empty'
import { PostSkeleton } from '../components/post-skeleton'
import { MemexListType } from '@/api/memex/types'
import { usePostList } from '../hooks/use-post-list'

export const Latest = () => {
  const { list, total, isLoading, fetchNextPage } = usePostList(
    MemexListType.Latest
  )

  return (
    <MemexLayout>
      <CustomSuspense
        isPending={isLoading}
        fallback={<PostSkeleton />}
        nullback={<PostEmpty />}
      >
        {list.map((t) => (
          <MemexPost key={t?.hash} post={t} />
        ))}
      </CustomSuspense>
    </MemexLayout>
  )
}

export default Latest
