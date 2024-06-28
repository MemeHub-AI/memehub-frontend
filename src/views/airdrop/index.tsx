import { useTranslation } from 'react-i18next'
import { useInfiniteQuery } from '@tanstack/react-query'

import { Ids } from './components/ids'
import { PrimaryLayout } from '@/components/layouts/primary'
import { CustomSuspense } from '@/components/custom-suspense'
import { AirdropCard } from './components/card'
import { data } from './data'
import { useUserStore } from '@/stores/use-user-store'
import { airdropApi } from '@/api/airdrop'

const Airdrop = () => {
  const { t } = useTranslation()
  const { hasIdentity, userInfo } = useUserStore()

  const { data, isLoading, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: [airdropApi.getList.name, userInfo?.id],
    queryFn: async ({ pageParam }) => {
      if (userInfo?.id == null) return Promise.reject()

      const { data } = await airdropApi.getList({ page: pageParam })
      return data
    },
    initialPageParam: 1,
    getNextPageParam: (_, _1, page) => page + 1,
    select: (data) => {
      return {
        total: data.pages[0].count,
        airdropList: data.pages.flatMap((p) => p?.results).filter(Boolean),
      }
    },
  })
  const airdrops = data?.airdropList

  const handleLoadStatus = () => {
    if (isFetching && data?.total) {
      return (
        <div className="mt-2 text-center" onClick={() => fetchNextPage()}>
          {t('loading')}
        </div>
      )
    }

    if (Number(data?.total) > Number(airdrops?.length)) {
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
    <PrimaryLayout container="div" className="py-5">
      <Ids />
      <h1 className="mt-5 text-2xl font-bold">{t('airdrop.you')}</h1>
      {hasIdentity() ? (
        <>
          <CustomSuspense
            isPending={isLoading}
            fallback={<div>loading...</div>}
            nullback={<div className="mt-3">{t('no.airdrop')}</div>}
            className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 mt-3 gap-4 max-w-max"
          >
            {airdrops?.map((airdrop, i) => (
              <AirdropCard key={i} airdrop={airdrop} />
            ))}
          </CustomSuspense>
          {handleLoadStatus()}
        </>
      ) : (
        <AirdropSkeleton />
      )}
    </PrimaryLayout>
  )
}

const AirdropSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 mt-3 gap-4 max-w-max">
      {data?.map((airdrop, i) => (
        <AirdropCard
          key={i}
          className="blur-md pointer-events-none select-none"
          airdrop={airdrop}
        />
      ))}
    </div>
  )
}

export default Airdrop
