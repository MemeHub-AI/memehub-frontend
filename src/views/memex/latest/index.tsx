import { type ReactNode } from 'react'

import { MemexIdeaCard } from '../components/idea-card'
import { CustomSuspense } from '@/components/custom-suspense'
import { IdeaEmpty } from '../components/idea-empty'
import { IdeaCardSkeleton } from '../components/idea-card/skeleton'
import { MemexListType } from '@/api/memex/types'
import { useIdeaList } from '../hooks/use-idea-list'
import { MemexInfiniteScroll } from '../components/memex-infinite-scroll'
import { getMemexLayout } from '..'

export const LatestPage = () => {
  const {
    list,
    idoInfos,
    total,
    isLoading,
    refetch,
    refetchIdoInfos,
    fetchNextPage,
  } = useIdeaList(MemexListType.Latest)

  return (
    <CustomSuspense
      className="mx-auto"
      isPending={isLoading}
      fallback={<IdeaCardSkeleton />}
      nullback={<IdeaEmpty />}
    >
      <MemexInfiniteScroll list={list} total={total} fetchNext={fetchNextPage}>
        {list.map((idea, i) => (
          <MemexIdeaCard
            key={idea?.hash}
            idea={idea}
            ideaInfo={idoInfos[i]}
            refetchInfo={refetchIdoInfos}
            onCommentSuccess={refetch}
          />
        ))}
      </MemexInfiniteScroll>
    </CustomSuspense>
  )
}

LatestPage.getLayout = (page: ReactNode) => getMemexLayout(page, true)

export default LatestPage
