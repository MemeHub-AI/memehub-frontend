import { newsApi } from '@/api/news'
import { MemeInfoDialogData } from '@/api/news/types'
import { Routes } from '@/routes'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useStorage } from './use-storage'
import { useAimemeInfoStore } from '@/stores/use-ai-meme-info-store'
import { defaultImg } from '@/config/link'

interface Options {
  isOpportunity?: boolean
}

export const useNewsList = (options?: Options) => {
  const { isOpportunity = false } = options || {}

  const { getArea } = useStorage()
  const [show, setShow] = useState(false)
  const [area, setArea] = useState(+getArea())
  const [loading, setLoading] = useState(false)
  const [memeit, setMemeit] = useState<MemeInfoDialogData>()

  const { push, pathname } = useRouter()

  const { data: country, isLoading } = useQuery({
    queryKey: [newsApi.getCountry.name],
    queryFn: newsApi.getCountry,
  })

  const hidden = () => {
    setShow(false)
  }

  const onConfirmCreate = () => {
    try {
      if (!memeit) return
      if (!pathname.startsWith(Routes.Create)) {
        const aimemeInfoStore = useAimemeInfoStore.getState()
        aimemeInfoStore.setInfo({
          name: memeit.title,
          description: memeit.title,
        })
        return push(Routes.Create)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleClick = async (info?: MemeInfoDialogData) => {
    setShow(true)
    setMemeit(info)
  }

  const {
    data: newsData,
    isLoading: isFetching,
    fetchNextPage,
    fetchPreviousPage,
  } = useInfiniteQuery({
    queryKey: [newsApi.getNews.name, area, isOpportunity],
    initialPageParam: 1,
    refetchInterval: 10_000,
    queryFn: async ({ pageParam }) => {
      if (isOpportunity) {
        const { data } = await newsApi.getOpportunity({
          page: pageParam,
          page_size: 7,
        })

        return {
          count: data.count,
          results: data.results?.map((item) => ({
            id: item.id,
            title: item?.title,
            link: '',
            content: item?.content,
            image: item?.image,
          })),
        }
      }

      const { data } = await newsApi.getNews({
        country: +area,
        page: pageParam,
      })

      return {
        count: data?.count,
        results: data?.results?.map((item) => ({
          id: item?.id,
          title: item?.title?.query,
          link: item?.title?.exploreLink,
          content: item?.articles?.[0]?.snippet,
          image: item?.articles?.[0]?.image?.imageUrl || defaultImg,
        })),
      }
    },
    getNextPageParam: (_, _1, page) => page + 1,
    select: (data) => {
      return {
        total: data.pages[0].count,
        newsList: data.pages.flatMap((p) => p.results).filter(Boolean),
      }
    },
  })

  return {
    area,
    show,
    loading,
    memeit,
    isFetching,
    loadingCountry: isLoading,
    newsList: newsData?.newsList,
    countryList: country?.data,
    handleClick,
    onConfirmCreate,
    hidden,
    setShow,
    setArea,
    fetchNextPage,
    fetchPreviousPage,
  }
}
