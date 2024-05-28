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
import { useAimemeInfoStore } from '@/stores/use-ai-meme-info-store'

interface Options {
  formData?: ReturnType<typeof useCreateTokenForm>
}

export const useNewsList = (options?: Options) => {
  const { formData } = options || {}
  const { getArea } = useStorage()
  const [show, setShow] = useState(false)
  const [area, setArea] = useState(+getArea())
  const [loading, setLoading] = useState(false)
  const [memeit, setMemeit] = useState<NewsData>()

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
        const aimemeInfoStore = useAimemeInfoStore.getState()
        aimemeInfoStore.setInfo({
          name: memeit.title.query,
          description: memeit.title.query,
        })
        return push(Routes.Create)
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
  }

  const { data: newsData, isFetching } = useInfiniteQuery({
    queryKey: [newsApi.getNews.name, area],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const { data } = await newsApi.getNews({
        country: +area,
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
    area,
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
    setArea,
    isLoadingMemeImg,
    isLoadingMemeInfo,
  }
}
