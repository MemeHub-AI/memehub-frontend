import { useState } from 'react'
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

export const AirdropPage = () => {
  const { t } = useTranslation()
  const [checked, setChecked] = useState(true)
  const { airdrops, total, isFetching, fetchNextPage } = useAirdropList()

  const handleLoadStatus = () => {
    if (isFetching && total) {
      return (
        <div className="mt-2 text-center" onClick={() => fetchNextPage()}>
          {t('loading')}
        </div>
      )
    }

    if (total > airdrops.length) {
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

        {(airdrops?.length ?? 0) > 5 && (
          <div className="flex space-x-2 items-center mt-3">
            <Switch
              id="airdrop-switch"
              checked={checked}
              onCheckedChange={setChecked}
            />
            <Label htmlFor="airdrop-switch">{t('airdrop.claimed.hide')}</Label>
          </div>
        )}

        <CustomSuspense
          isPending={false}
          fallback={<div>{t('loading')}</div>}
          nullback={<div className="mt-3">{t('no.airdrop')}</div>}
          className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 mt-3 gap-4 "
        >
          {/* <IdoAirdropCard tag={t('ido.airdrop.kol')} isKolAirdrop />
          <IdoAirdropCard tag={t('ido.airdrop.community')} /> */}
          {airdrops.map((a, i) =>
            a?.airdrop.map((detail) => (
              <AirdropCard
                key={i}
                airdrop={a}
                detail={detail}
                isKolCard={detail.type === AirdropDetailType.Kol}
              />
            ))
          )}
        </CustomSuspense>

        {/* {isKol || community ? (
          <>
            <CustomSuspense
              isPending={isLoading}
              fallback={<div>{t('loading')}</div>}
              nullback={<div className="mt-3">{t('no.airdrop')}</div>}
              className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 mt-3 gap-4 "
            >
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
          detail={airdrop.airdrop[0]}
          isKolCard
        />
      ))}
    </div>
  )
}

export default AirdropPage
