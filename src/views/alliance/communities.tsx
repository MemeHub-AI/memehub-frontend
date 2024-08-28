import { useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash'

import { allianceApi } from '@/api/alliance'
import { CustomSuspense } from '@/components/custom-suspense'
import { NewsAsideMobile } from '@/components/news-aside'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useUserStore } from '@/stores/use-user-store'
import { CommunityCard } from '@/components/community-card'
import { Input } from '@/components/ui/input'
import { utilLang } from '@/utils/lang'
import { memehubLinks } from '@/config/link'

export const Communities = () => {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const { userInfo } = useUserStore()

  const {
    data: { communities = [], total = 0 } = {},
    isLoading,
    fetchNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: [allianceApi.getCommunity.name, search],
    queryFn: async ({ pageParam }) => {
      const { data } = await allianceApi.getCommunity({
        page: pageParam,
        search,
      })
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

  const handleLoadStatus = () => {
    if (isFetching && total) {
      return (
        <div className="mt-2 text-center" onClick={() => fetchNextPage()}>
          {t('loading')}
        </div>
      )
    }

    if (Number(total) > Number(communities?.length)) {
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

  const onChagne = debounce((value) => setSearch(value), 500)

  return (
    <>
      <div className="pb-5 pr-4 max-sm:pr-0">
        <NewsAsideMobile>
          <Button
            className="md:hidden -translate-y-1 -translate-x-1 max-sm:-translate-x-0 max-sm:-translate-y-0  max-sm:hidden"
            size={'icon'}
          >
            🔥
          </Button>
        </NewsAsideMobile>
        <div className="my-3">
          {utilLang.replace(t('community.desc'), [total || '-'])}
        </div>
        {userInfo?.role?.community ? null : (
          <Button onClick={() => open(memehubLinks.communityForm)}>
            {t('apply.community')}
          </Button>
        )}
        <Input
          placeholder={t('community.search')}
          onChange={({ target }) => onChagne(target.value)}
          className="max-w-[270px] mt-4"
        />
        <CustomSuspense
          className="mt-5 gap-4 w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
          isPending={isLoading}
          fallback={<CardSkeleton />}
          nullback={<div className="mt-4">{t('no.communities')}</div>}
        >
          {communities?.map((c) => {
            return <CommunityCard key={c!.id} data={c} />
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
