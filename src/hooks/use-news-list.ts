import { aiApi } from '@/api/ai'
import { AIMemeInfo } from '@/api/ai/type'
import { newsApi } from '@/api/news'
import { NewsData } from '@/api/news/types'
import { Routes } from '@/routes'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useAIMemeInfo } from './use-ai-meme-info'
import { useCreateTokenForm } from '@/views/create/hooks/use-form'
import { useStorage } from './use-storage'

interface Options {
  formData?: ReturnType<typeof useCreateTokenForm>
}

export const useNewsList = (options?: Options) => {
  const { formData } = options || {}
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [memeit, setMemeit] = useState<NewsData>()

  const { getArea } = useStorage()

  const { isLoadingMemeImg, isLoadingMemeInfo, getAIMemeInfo } = useAIMemeInfo()

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
        push(
          `${Routes.Create}?title=${encodeURIComponent(
            memeit.title.query
          )}&description=`
        )
        return
      }
      if (formData) {
        getAIMemeInfo(memeit.title.query!)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleClick = async (news?: NewsData) => {
    setShow(true)
    setMemeit(news)
    console.log(news)
  }

  const { data: newsData, isFetching } = useInfiniteQuery({
    queryKey: [newsApi.getNews.name],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const { data } = await newsApi.getNews({
        country: +getArea(),
        page: pageParam,
      })
      return data
    },
    getNextPageParam: (_, _1, page) => page + 1,
    select: (data) => ({
      total: data.pages[0].count,
      newsList: data.pages.flatMap((p) => p.results).filter(Boolean),
    }),
  })

  return {
    show,
    loading,
    memeit,
    loadingCountry: isLoading,
    newsList: newsData?.newsList,
    countryList: country?.data,
    isFetching,
    handleClick,
    onConfirmCreate,
    hidden,
    setShow,
    isLoadingMemeImg,
    isLoadingMemeInfo,
  }
}
