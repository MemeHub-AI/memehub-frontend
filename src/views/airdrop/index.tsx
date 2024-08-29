import React, { type ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Ids } from './components/ids'
import { PrimaryLayout } from '@/components/layouts/primary'
import { CustomSuspense } from '@/components/custom-suspense'
import { AirdropCard } from './components/card'
import { airdropData } from './data'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { AirdropProvider } from '@/contexts/airdrop'
import { useAirdropList } from './hooks/use-airdrop-list'
import { AirdropDetailType } from '@/api/airdrop/types'
import { useUserStore } from '@/stores/use-user-store'
import { useLocalStorage } from '@/hooks/use-storage'
import { strToBool } from '@/utils'
import { LoadMore } from '@/components/load-more'

export const AirdropPage = () => {
  const { t } = useTranslation()
  const {
    airdrops,
    airdropInfos,
    total,
    isLoading,
    isFetching,
    fetchNextPage,
  } = useAirdropList()
  const { isKol, hasCommunity } = useUserStore()

  const { getStorage, setStorage } = useLocalStorage()
  const [checked, setChecked] = useState(
    strToBool(getStorage('airdrop_checked'))
  )

  useEffect(() => {
    setStorage('airdrop_checked', String(checked))
  }, [checked])

  return (
    <AirdropProvider value={{ shouldHideClaimed: checked }}>
      <Ids />
      <h1 className="mt-5 text-2xl font-bold">{t('airdrop.you')}</h1>

      {(airdrops.length ?? 0) > 5 && (
        <div className="flex space-x-2 items-center mt-3">
          <Switch
            id="airdrop-switch"
            checked={checked}
            onCheckedChange={setChecked}
          />
          <Label htmlFor="airdrop-switch">{t('airdrop.claimed.hide')}</Label>
        </div>
      )}

      {isKol || hasCommunity ? (
        <CustomSuspense
          isPending={isLoading}
          fallback={<div>{t('loading')}</div>}
          nullback={<div className="mt-3">{t('no.airdrop')}</div>}
          className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 mt-3 gap-4 "
        >
          {airdrops.map((a, i) =>
            a?.airdrop.map((detail) => (
              <AirdropCard
                key={i}
                isKolCard={detail.type === AirdropDetailType.Kol}
                airdrop={a}
                distribution={airdropInfos[i]}
              />
            ))
          )}
          <LoadMore
            className="text-center lg:col-span-2 2xl:col-span-3"
            list={airdrops}
            total={total}
            isLoading={isFetching}
            onFetchMore={fetchNextPage}
          />
        </CustomSuspense>
      ) : (
        <AirdropSkeleton />
      )}
    </AirdropProvider>
  )
}

AirdropPage.getLayout = (page: ReactNode) => {
  return <PrimaryLayout>{page}</PrimaryLayout>
}

const AirdropSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 mt-3 gap-4 max-w-max">
      {airdropData.map((airdrop, i) => (
        <AirdropCard
          key={i}
          className="blur-lg pointer-events-none select-none"
          isKolCard
          airdrop={airdrop}
          distribution={undefined}
        />
      ))}
    </div>
  )
}

export default AirdropPage
