import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useScroll } from 'ahooks'

import { newsApi } from '@/api/news'
import { useLocalStorage } from './use-storage'
import { defaultImg } from '@/config/link'
import { utilTime } from '@/utils/day'

interface Options {
  isOpportunity?: boolean
}

export const newsDefaultArea = '24'

export const useNewsList = (options?: Options) => {
  const { isOpportunity = false } = options || {}
  const { getStorage } = useLocalStorage()
  const storedArea = Number(getStorage('area') || newsDefaultArea)

  const [area, setArea] = useState(storedArea)
  const ref = useRef<HTMLDivElement>(null)
  const { top } = useScroll(ref) ?? { top: 0 }
  const newsListKeys = [newsApi.getNews.name, area, isOpportunity]

  const {
    data: newsData,
    isLoading,
    isFetching,
    hasNextPage,
    isFetchNextPageError,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: newsListKeys,
    initialPageParam: 1,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    queryFn: async ({ pageParam }) => {
      if (isFetchNextPageError) throw new Error('fetching next page')
      let result: any

      if (isOpportunity) {
        const getData: any = async () => {
          try {
            const { data } = await newsApi.getNewsMeme({
              page: pageParam,
              page_size: 10,
            })
            if (data)
              result = {
                count: data.count,
                results: data.results?.map((item) => ({
                  id: item.id,
                  title: item?.title,
                  content: item?.description,
                  image: item?.logo,
                })),
              }
          } catch (error) {
            await utilTime.wait(2000)
            result = await getData()
          }
        }
        await getData()
        return result
      }
      const getData: any = async () => {
        try {
          const { data } = await newsApi.getNews({
            country: storedArea,
            page: pageParam,
            page_size: 10,
          })
          if (data)
            result = {
              count: data?.count,
              results: data?.results?.map((item) => ({
                id: item?.id,
                title: item?.title,
                content: item?.description,
                image: item?.logo || defaultImg,
              })),
            }
        } catch (error) {
          await utilTime.wait(2000)
          result = await getData()
        }
      }

      await getData()
      return result
    },
    getNextPageParam: (_, _1, page) => page + 1,
    select: (data) => {
      return {
        total: data.pages[0].count,
        newsList: data.pages.flatMap((p) => p?.results).filter(Boolean),
      }
    },
  })

  useEffect(() => {
    if (!ref.current) return
    const { scrollHeight, clientHeight } = ref.current

    if (
      scrollHeight - top < clientHeight * 1.5 &&
      !isFetching &&
      !isFetchNextPageError &&
      hasNextPage &&
      newsData?.total > (newsData?.newsList?.length || 0)
    ) {
      fetchNextPage()
    }
  }, [top, isFetchNextPageError])

  return {
    ref,
    area,
    isLoading,
    isFetching,
    newsList: newsData?.newsList,
    setArea,
    fetchNextPage,
  }
}
