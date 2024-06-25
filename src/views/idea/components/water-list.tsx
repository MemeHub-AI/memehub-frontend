import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useWindowScroll, useWindowSize } from 'react-use'
import { useInfiniteQuery } from '@tanstack/react-query'

import { ideaApi } from '@/api/idea'
import { CustomSuspense } from '@/components/custom-suspense'
import { Skeleton } from '@/components/ui/skeleton'
import { TokenInfo } from './token-info'
import { queryClient } from '@/components/app-providers'
import { IdeaDataList } from '@/api/idea/type'
import { TokenList } from './token-list'

interface Props {
  newsId: string
  type: string
}

export const WaterList = ({ newsId, type }: Props) => {
  const { t } = useTranslation()
  const { y } = useWindowScroll()
  const { width } = useWindowSize()

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
      const list = result.pages.flatMap((p) => p.data.results)

      let count = 0
      const limit = width > 1550 ? 4 : width > 1220 ? 3 : width > 600 ? 2 : 1

      const waterfallList = new Array<IdeaDataList[]>(limit)
        .fill([])
        .map(() => [] as IdeaDataList[])

      list?.forEach((item) => {
        waterfallList[count].push(item!)
        if (++count === limit) {
          return (count = 0)
        }
      })
      return {
        list: waterfallList,
        current: list.length,
        total: result.pages[0]?.data.count,
      }
    },
  })

  useEffect(() => {
    // 检查是否滚动到底部
    if (
      window.innerHeight +
        document.documentElement.scrollTop -
        document.documentElement.offsetHeight >=
        -(window.innerHeight / 2) &&
      hasNextPage &&
      !isFetching &&
      !isFetchNextPageError &&
      Number(waterfallList?.total) > Number(waterfallList?.current)
    ) {
      // 加载下一页的数据
      fetchNextPage()
    }
  }, [y])

  useEffect(() => {
    queryClient.resetQueries({ queryKey, exact: true })
  }, [newsId, type])

  return (
    <>
      {waterfallList?.list.length ? (
        <div className="my-5">{t('go.bold.man')} </div>
      ) : null}

      <CustomSuspense
        isPending={isLoading}
        fallback={<WaterSkeleton />}
        nullback={<div className="mt-5 text-gray-500">{t('no.idea')}</div>}
      >
        {waterfallList?.list?.length ? (
          <div className="flex gap-4 pb-6">
            {waterfallList.list?.map((cols, i) => {
              return (
                <div
                  key={i}
                  className="flex-1  max-sm:w-full max-sm:max-w-full"
                >
                  {cols.map((item) => (
                    <div
                      key={item.id}
                      className="mb-2 border-black rounded-lg border-2 py-2 max-sm:py-3"
                    >
                      <TokenInfo ideaData={item} />
                      <TokenList ideaData={item} />
                    </div>
                  ))}
                </div>
              )
            })}
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
