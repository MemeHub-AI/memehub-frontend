import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useInfiniteQuery } from '@tanstack/react-query'

import { Ids } from './components/ids'
import { PrimaryLayout } from '@/components/layouts/primary'
import { CustomSuspense } from '@/components/custom-suspense'
import { AirdropCard } from './components/card'
import { airdropData } from './data'
import { useUserStore } from '@/stores/use-user-store'
import { airdropApi } from '@/api/airdrop'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { AirdropProvider } from '@/contexts/airdrop'
import { useIdoCheck } from '../ido/hooks/use-ido-check'
import { idoChain } from '@/config/ido'
import { IdoAirdropCard } from './components/ido-card'

const Airdrop = () => {
  const { t } = useTranslation()
  const { hasIdentity, userInfo } = useUserStore()
  const [checked, setChecked] = useState(true)

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
    enabled: false,
  })
  const airdrops = data?.airdropList

  const { isKol, community } = useIdoCheck(idoChain.id)

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
    <AirdropProvider value={{ hideClaimed: checked }}>
      <PrimaryLayout container="div" className="py-5 flex-col gap-0 w-full">
        <Ids />
        <h1 className="mt-5 text-2xl font-bold">{t('airdrop.you')}</h1>

        {/* <div className="flex space-x-2 items-center mt-3">
          <Switch
            id="airdrop-switch"
            checked={checked}
            onCheckedChange={setChecked}
          />
          <Label htmlFor="airdrop-switch">{t('airdrop.claimed.hide')}</Label>
        </div> */}

        <CustomSuspense
          isPending={false}
          fallback={<div>{t('loading')}</div>}
          nullback={<div className="mt-3">{t('no.airdrop')}</div>}
          className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 mt-3 gap-4 "
        >
          <IdoAirdropCard tag={t('ido.airdrop.kol')} isKolAirdrop />
          <IdoAirdropCard tag={t('ido.airdrop.community')} />
          {airdrops?.map((airdrop, i) => (
            <AirdropCard key={i} airdrop={airdrop} />
          ))}
        </CustomSuspense>

        {/* {isKol || community ? (
          <>
            <CustomSuspense
              isPending={isLoading}
              fallback={<div>{t('loading')}</div>}
              nullback={<div className="mt-3">{t('no.airdrop')}</div>}
              className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 mt-3 gap-4 "
            >
              <IdoAirdropCard tag={t('ido.airdrop.kol')} isKolAirdrop />
              <IdoAirdropCard tag={t('ido.airdrop.community')} />
              {airdrops?.map((airdrop, i) => (
                <AirdropCard key={i} airdrop={airdrop} />
              ))}
            </CustomSuspense>
            {handleLoadStatus()}
          </>
        ) : (
          <AirdropSkeleton />
        )} */}
      </PrimaryLayout>
    </AirdropProvider>
  )
}

const AirdropSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 mt-3 gap-4 max-w-max">
      {airdropData.map((airdrop, i) => (
        <AirdropCard
          key={i}
          className="blur-lg pointer-events-none select-none"
          airdrop={airdrop}
        />
      ))}
    </div>
  )
}

export default Airdrop
