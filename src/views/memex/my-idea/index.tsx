import React from 'react'

import { MemexLayout } from '../components/memex-layout'
import { CustomSuspense } from '@/components/custom-suspense'
import { MemexPost } from '../components/memex-post'
import { PostEmpty } from '../components/post-empty'
import { PostSkeleton } from '../components/post-skeleton'
import { usePostList } from '../hooks/use-post-list'
import { MemexListType } from '@/api/memex/types'

export const MyIdea = () => {
  const { list, total, isLoading, fetchNextPage } = usePostList(
    MemexListType.My
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

export default MyIdea
