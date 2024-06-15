import { allianceApi } from '@/api/alliance'
import { AmbassadorCard } from '@/components/ambassador-card'
import CustomSuspense from '@/components/custom-suspense'
import { PrimaryLayout } from '@/components/layouts/primary'
import {
  MobileQpportunityMoonshot,
  OpportunityMoonshot,
} from '@/components/opportunity-moonshot'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

const KOLPage = () => {
  const { t } = useTranslation()

  const { data, isLoading, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: [allianceApi.getKols.name],
    queryFn: async ({ pageParam }) => {
      const { data } = await allianceApi.getKols({ page: pageParam })
      return data
    },
    initialPageParam: 1,
    getNextPageParam: (_, _1, page) => page + 1,
    select: (data) => {
      return {
        total: data.pages[0].count,
        newsList: data.pages.flatMap((p) => p?.results).filter(Boolean),
      }
    },
  })

  const handleLoadStatus = () => {
    if (isFetching && data?.total != null) {
      return (
        <div className="mt-2 text-center" onClick={() => fetchNextPage()}>
          {t('loading')}
        </div>
      )
    }

    if (data?.total !== kols?.length) {
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

  const kols = data?.newsList
  return (
    <PrimaryLayout>
      <div className="py-5 pr-4">
        <h1 className="text-2xl max-sm:flex max-sm:justify-between ">
          {t('kol.ambassador')}
          <MobileQpportunityMoonshot>
            <Button
              className="md:hidden -translate-y-1 -translate-x-1"
              size={'icon'}
            >
              🔥
            </Button>
          </MobileQpportunityMoonshot>
        </h1>
        <div className="my-3">
          {t('kol.desc').replace('$1', `${data?.total}` || '-')}
        </div>
        <Button>{t('apply.kol')}</Button>
        <CustomSuspense
          className="mt-5 grid grid-cols-3 gap-4 w-full max-xl:grid-cols-2 max-md:grid-cols-1"
          isPending={isLoading}
          fallback={<CardSkeleton></CardSkeleton>}
          nullback={<div className="mt-4">{t('no.kol')}</div>}
        >
          {kols?.map((kol) => {
            return <AmbassadorCard key={kol!.id} data={kol}></AmbassadorCard>
          })}
        </CustomSuspense>
        {handleLoadStatus()}
      </div>
    </PrimaryLayout>
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

export default KOLPage
