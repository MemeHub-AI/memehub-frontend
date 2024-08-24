import { MemexLayout } from '../components/memex-layout'
import { MemexIdeaCard } from '../components/idea-card'
import { CustomSuspense } from '@/components/custom-suspense'
import { IdeaEmpty } from '../components/idea-empty'
import { IdeaCardSkeleton } from '../components/idea-card-skeleton'
import { MemexListType } from '@/api/memex/types'
import { useIdeaList } from '../hooks/use-idea-list'
import { MemexInfiniteScroll } from '../components/memex-infinite-scroll'
import { MemexTabs } from '../components/memex-tabs'

export const Latest = () => {
  const { list, total, isLoading, refetch, fetchNextPage } = useIdeaList(
    MemexListType.Latest
  )

  return (
    <MemexLayout>
      <MemexTabs>
        <CustomSuspense
          isPending={isLoading}
          fallback={<IdeaCardSkeleton />}
          nullback={<IdeaEmpty />}
        >
          <MemexInfiniteScroll
            list={list}
            total={total}
            fetchNext={fetchNextPage}
          >
            {list.map((t) => (
              <MemexIdeaCard
                key={t?.hash}
                idea={t}
                onCommentSuccess={refetch}
              />
            ))}
          </MemexInfiniteScroll>
        </CustomSuspense>
      </MemexTabs>
    </MemexLayout>
  )
}

export default Latest
