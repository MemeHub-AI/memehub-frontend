import { newsApi } from '@/api/news'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useStorage } from './use-storage'
import { defaultImg } from '@/config/link'
import { useScroll } from 'react-use'
import { utilTime } from '@/utils/time'

interface Options {
  isOpportunity?: boolean
}

export const useNewsList = (options?: Options) => {
  const { isOpportunity = false } = options || {}

  const { getArea } = useStorage()
  const [area, setArea] = useState(+getArea())
  const ref = useRef<HTMLDivElement>(null)
  const { y } = useScroll(ref)
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
                  link: '',
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
            country: +getArea(),
            page: pageParam,
            page_size: 10,
          })
          if (data)
            result = {
              count: data?.count,
              results: data?.results?.map((item) => ({
                id: item?.id,
                title: item?.title?.query,
                link: item?.title?.exploreLink,
                content: item?.articles?.[0]?.snippet,
                image: item?.image?.imageUrl || defaultImg,
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
      scrollHeight - y < clientHeight * 1.5 &&
      !isFetching &&
      !isFetchNextPageError &&
      hasNextPage &&
      newsData?.total > (newsData?.newsList?.length || 0)
    ) {
      fetchNextPage()
    }
  }, [y, isFetchNextPageError])

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
