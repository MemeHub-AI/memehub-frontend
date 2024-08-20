import { MemexLayout } from '../components/memex-layout'
import { CustomSuspense } from '@/components/custom-suspense'
import { MemexIdeaCard } from '../components/idea-card'
import { IdeaEmpty } from '../components/idea-empty'
import { IdeaCardSkeleton } from '../components/idea-card-skeleton'
import { useIdeaList } from '../hooks/use-idea-list'
import { MemexListType } from '@/api/memex/types'
import { MemexInfiniteScroll } from '../components/memex-infinite-scroll'

export const MyInvolved = () => {
  const { list, total, isLoading, refetch, fetchNextPage } = useIdeaList(
    MemexListType.Join
  )

  return (
    <MemexLayout>
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
            <MemexIdeaCard key={t?.hash} idea={t} onCommentSuccess={refetch} />
          ))}
        </MemexInfiniteScroll>
      </CustomSuspense>
    </MemexLayout>
  )
}

export default MyInvolved
