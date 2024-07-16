import { useState } from 'react'
import { debounce } from 'lodash'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { allianceApi } from '@/api/alliance'
import { AmbassadorCard } from '@/components/ambassador-card'
import CustomSuspense from '@/components/custom-suspense'
import { MobileQpportunityMoonshot } from '@/components/opportunity-moonshot'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useUserStore } from '@/stores/use-user-store'
import { Input } from '@/components/input'
import { cn } from '@/lib/utils'
import { useWalletStore } from '@/stores/use-wallet-store'
import { useAccount } from 'wagmi'
import { kolFormLink } from '@/config/link'
import { KolCard } from '@/components/kol-card'

export const Kol = () => {
  const { t } = useTranslation()
  const { userInfo } = useUserStore()
  const [value, setValue] = useState('')
  const { isConnected } = useAccount()
  const { setConnectOpen } = useWalletStore()

  const { data, isLoading, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: [allianceApi.getKols.name, value],
    queryFn: async ({ pageParam }) => {
      const { data } = await allianceApi.getKols({
        page: pageParam,
        search: value,
      })
      return data
    },
    initialPageParam: 1,
    getNextPageParam: (_, _1, page) => page + 1,
    select: (data) => {
      return {
        total: data.pages[0].count,
        kol: data.pages.flatMap((p) => p?.results).filter(Boolean),
      }
    },
  })

  const handleLoadStatus = () => {
    if (isFetching && data?.total) {
      return (
        <div className="mt-2 text-center" onClick={() => fetchNextPage()}>
          {t('loading')}
        </div>
      )
    }

    if (Number(data?.total) > Number(kols?.length)) {
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

  const kols = data?.kol
  const onChange = debounce((value) => setValue(value), 300)

  return (
    <>
      <div className="pb-5 pr-4 max-sm:pr-0">
        <MobileQpportunityMoonshot>
          <Button
            className="md:hidden -translate-y-1 -translate-x-1 max-sm:-translate-y-0 max-sm:-translate-x-0 max-sm:hidden"
            size={'icon'}
          >
            🔥
          </Button>
        </MobileQpportunityMoonshot>
        <div className="my-3">
          {t('kol.desc').replace('$1', `${data?.total}` || '-')}
        </div>

        {userInfo?.role?.kol ? null : (
          <Button
            className="mb-4"
            onClick={() => {
              if (!isConnected) {
                setConnectOpen(true)
                return
              }
              open(kolFormLink)
            }}
          >
            {t('apply.kol')}
          </Button>
        )}

        <div>
          <Input
            className={cn('max-w-[300px] max-sm:max-w-full border-1')}
            onChange={({ target }) => onChange(target.value)}
            placeholder={t('search.kol')}
          />
        </div>

        {/* {userInfo?.role?.kol ? null : <Button>{t('apply.kol')}</Button>} */}
        {/* <Input
          className={cn('shadow-offset h-9 select-none', className)}
          value={value}
          onChange={({ target }) => setValue(target.value)}
          placeholder={t('search.placeholder')}
          startIcon={
            <MagnifyingGlassIcon
              width={18}
              height={18}
              className="cursor-pointer ml-2"
              onClick={onSearch}
            />
          }
        /> */}
        <CustomSuspense
          className="mt-4 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 w-full"
          isPending={isLoading}
          fallback={<CardSkeleton></CardSkeleton>}
          nullback={<div className="mt-4">{t('no.kol')}</div>}
        >
          {kols?.map((kol) => {
            // return <AmbassadorCard key={kol!.id} data={kol}></AmbassadorCard>
            return <KolCard data={kol} key={kol?.id} />
          })}
        </CustomSuspense>
        {handleLoadStatus()}
      </div>
    </>
  )
}

const CardSkeleton = () => {
  return Array.from({ length: 3 }).map((_, i) => (
    <div className="flex items-center gap-4 relative" key={i}>
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

export default Kol

// Trump President
// Baby Trump
// Trump Politics
// Trump Us
// Controversy Trump
// Trump Controversy
// Politics Trump
// Trump Businessman
// Trump Businessman

// Kennedy Eagle
// John f. kennedy Maga
// John f. Lino
// Kooky Kennedy
// Lol John f. kennedy
// Tiger Kennedy
// John f. Rabbit
