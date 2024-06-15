import { OpportunityMoonshot } from '@/components/opportunity-moonshot'
import { useTranslation } from 'react-i18next'
import { Ids } from './components/ids'
import { allianceApi } from '@/api/alliance'
import { useInfiniteQuery } from '@tanstack/react-query'
import CustomSuspense from '@/components/custom-suspense'
import { AirdropCard } from './components/card'
import { useAccount } from 'wagmi'
import { data } from './data'
import { Button } from '@/components/ui/button'

const Airdrop = () => {
  const { t } = useTranslation()
  const { isConnected } = useAccount()
  const { data, isLoading, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: [allianceApi.getAirdrop.name],
    queryFn: async ({ pageParam }) => {
      const { data } = await allianceApi.getAirdrop({ page: pageParam })
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
    <main className="min-h-main flex gap-6 mx-auto max-md:flex-col max-md:items-center max-sm:gap-8 pr-5 max-sm:px-2">
      <OpportunityMoonshot defalutTab={0} className="max-md:!hidden" />
      <div className="py-5">
        <Ids></Ids>
        <h1 className="mt-5 text-2xl">{t('airdrop.you')}</h1>
        {isConnected ? (
          <>
            <CustomSuspense
              isPending={isLoading}
              fallback={<div></div>}
              nullback={<div className="mt-3">{t('no.airdrop')}</div>}
              className="mt-3 flex flex-wrap gap-4 max-w-max"
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
      </div>
    </main>
  )
}

const AirdropSkeleton = () => {
  return (
    <div className="relative mt-6 flex flex-wrap gap-5 max-w-max ">
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
