import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useScroll } from 'ahooks'

import { ideaApi } from '@/api/idea'
import { CustomSuspense } from '@/components/custom-suspense'
import { Skeleton } from '@/components/ui/skeleton'
import { TokenInfo } from './token-info'
import { queryClient } from '@/components/app-providers'
import { TokenList } from './token-list'
import dynamic from 'next/dynamic'
import { useResponsive } from '@/hooks/use-responsive'

interface Props {
  newsId: string
  type: string
}

const Layout = dynamic(() => import('react-masonry-list'), {
  ssr: false,
})

export const WaterList = ({ newsId, type }: Props) => {
  const { t } = useTranslation()
  const { top } = useScroll(document) ?? { top: 0 }
  // const { width } = useSize(document.querySelector('html')) ?? { width: 0 }
  const { isMobile, isPad } = useResponsive()

  const queryKey = [ideaApi.getIdeaList.name, newsId, type]

  const {
    data: waterfallList,
    isLoading,
    isFetching,
    isFetchNextPageError,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => {
      if (newsId == undefined || type === undefined) {
        throw new Error('newsId is undefined')
      }

      return ideaApi.getIdeaList(newsId, { page: pageParam, type })
    },
    initialPageParam: 1,
    getNextPageParam: (_, __, page) => {
      return page + 1
    },
    select: (result) => {
      const nextPages = result.pages[result.pages.length - 1]

      return {
        list: result.pages.flatMap((p) => p.data.results),
        isNextPages: nextPages.data.next !== null,
      }
    },
  })

  useEffect(() => {
    if (
      window.innerHeight +
        document.documentElement.scrollTop -
        document.documentElement.offsetHeight >=
        -(window.innerHeight / 2) &&
      hasNextPage &&
      !isFetching &&
      !isFetchNextPageError &&
      waterfallList?.isNextPages
    ) {
      fetchNextPage()
    }
  }, [top])

  useEffect(() => {
    queryClient.resetQueries({ queryKey, exact: true })
  }, [newsId, type])

  return (
    <>
      {waterfallList?.list ? (
        <div className="my-5">{t('go.bold.man')} </div>
      ) : null}

      <CustomSuspense
        isPending={isLoading}
        fallback={<WaterSkeleton />}
        nullback={<div className="mt-5 text-gray-500">{t('no.idea')}</div>}
      >
        {waterfallList?.list ? (
          <div className="pb-6">
            <Layout
              colCount={isPad ? (isMobile ? 1 : 2) : 3}
              gap={10}
              minWidth={200}
              className="max-sm:w-full max-sm:max-w-full w-full"
              items={waterfallList.list.map((item) => (
                <div
                  key={item?.id}
                  className="border-black rounded-lg border-2 py-2 max-sm:py-3 !h-auto"
                >
                  <TokenInfo ideaData={item} />
                  <TokenList ideaData={item} />
                </div>
              ))}
            />
          </div>
        ) : null}
      </CustomSuspense>
      {isFetching && !isLoading ? (
        <div className="text-center my-5">{t('loading')}</div>
      ) : null}
    </>
  )
}

const WaterSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-3 max-sm:grid-cols-1 max-sm:gap-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div className="flex gap-2 relative" key={i}>
          <div className="w-full my-2 flex flex-col gap-2 mr-2">
            <Skeleton className="w-1/2 h-4" />
            <Skeleton className="w-1/3 h-3" />
            <Skeleton className="w-[70%] h-3" />
            <Skeleton className="w-1/2 h-4" />
            <Skeleton className="w-1/3 h-3" />
            <Skeleton className="w-[70%] h-3" />
            <Skeleton className="w-1/2 h-3" />
            <Skeleton className="w-full h-5 rounded-full mt-2" />
          </div>
          <Skeleton className="w-8 h-8 absolute right-2 top-2" />
        </div>
      ))}
    </div>
  )
}
