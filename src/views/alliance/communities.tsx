import { useInfiniteQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { allianceApi } from '@/api/alliance'
import { AmbassadorCard } from '@/components/ambassador-card'
import { CustomSuspense } from '@/components/custom-suspense'
import { MobileQpportunityMoonshot } from '@/components/opportunity-moonshot'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export const Communities = () => {
  const { t } = useTranslation()

  const { data, isLoading, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: [allianceApi.getCommunity.name],
    queryFn: async ({ pageParam }) => {
      const { data } = await allianceApi.getCommunity({ page: pageParam })
      return data
    },
    initialPageParam: 1,
    getNextPageParam: (_, _1, page) => page + 1,
    select: (data) => {
      return {
        total: data.pages[0].count,
        communities: data.pages.flatMap((p) => p?.results).filter(Boolean),
      }
    },
  })
  const communities = data?.communities

  const handleLoadStatus = () => {
    if (isFetching && !data?.total) {
      return (
        <div className="mt-2 text-center" onClick={() => fetchNextPage()}>
          {t('loading')}
        </div>
      )
    }

    if (Number(data?.total) > Number(communities?.length)) {
      return (
        <div
          className="mt-2 text-center text-blue-700 cursor-pointer hover:text-blue-500"
          onClick={() => fetchNextPage()}
        >
          {t('loading.more')}
        </div>
      )
    }
  }

  return (
    <>
      <div className="pb-5 pr-4 max-sm:pr-0">
        <MobileQpportunityMoonshot>
          <Button
            className="md:hidden -translate-y-1 -translate-x-1"
            size={'icon'}
          >
            🔥
          </Button>
        </MobileQpportunityMoonshot>
        <div className="my-3">
          {t('community.desc').replace('$1', `${data?.total}` || '-')}
        </div>
        <Button>{t('apply.community')}</Button>
        <CustomSuspense
          className="mt-5 gap-4 w-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3"
          isPending={isLoading}
          fallback={<CardSkeleton></CardSkeleton>}
          nullback={<div className="mt-4">{t('no.communities')}</div>}
        >
          {communities?.map((communitie) => {
            return (
              <AmbassadorCard
                key={communitie!.id}
                data={communitie!}
              ></AmbassadorCard>
            )
          })}
        </CustomSuspense>
        {handleLoadStatus()}
      </div>
    </>
  )
}

const CardSkeleton = () => {
  return Array.from({ length: 3 }).map((_, i) => (
    <div
      className="flex items-center
     gap-4 relative"
      key={i}
    >
      <Skeleton className="w-20 h-20 flex-shrink-0 rounded-full" />

      <div className="w-full my-2 flex flex-col gap-2 mr-2">
        <Skeleton className="w-1/2 h-6" />
        <Skeleton className="w-[70%] h-3" />
        <Skeleton className="w-1/2 h-3" />
        <Skeleton className="w-full h-3 rounded-full mt-2" />
      </div>
    </div>
  ))
}

export default Communities