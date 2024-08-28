import { type ReactNode } from 'react'

import { MemexIdeaCard } from '../components/idea-card'
import { CustomSuspense } from '@/components/custom-suspense'
import { IdeaEmpty } from '../components/idea-empty'
import { IdeaCardSkeleton } from '../components/idea-card/skeleton'
import { MemexListType } from '@/api/memex/types'
import { useIdeaList } from '../hooks/use-idea-list'
import { MemexInfiniteScroll } from '../components/memex-infinite-scroll'
import { getMemexLayout } from '..'
import IdeaTest from '../components/idea-test'

export const LatestPage = () => {
  const { list, total, isLoading, refetch, fetchNextPage } = useIdeaList(
    MemexListType.Latest
  )

  // console.log('latest', list)

  return (
    <CustomSuspense
      className="mx-auto"
      isPending={isLoading}
      fallback={<IdeaCardSkeleton />}
      nullback={<IdeaEmpty />}
    >
      <MemexInfiniteScroll list={list} total={total} fetchNext={fetchNextPage}>
        {/* <IdeaTest /> */}
        {list.map((t) => (
          <MemexIdeaCard key={t?.hash} idea={t} onCommentSuccess={refetch} />
        ))}
      </MemexInfiniteScroll>
    </CustomSuspense>
  )
}

LatestPage.getLayout = (page: ReactNode) => getMemexLayout(page, true)

export default LatestPage
