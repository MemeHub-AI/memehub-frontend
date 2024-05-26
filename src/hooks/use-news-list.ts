import { aiApi } from '@/api/ai'
import { AIMemeInfo } from '@/api/ai/type'
import { newsApi } from '@/api/news'
import { NewsData } from '@/api/news/types'
import { Routes } from '@/routes'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useAIMemeInfo } from './use-ai-meme-info'
import { useCreateTokenForm } from '@/views/create/hooks/use-form'

interface Options {
  formData?: ReturnType<typeof useCreateTokenForm>
}

export const useNewsList = (options?: Options) => {
  const { formData } = options || {}
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const { isLoadingMemeImg, isLoadingMemeInfo, getAIMemeInfo } = useAIMemeInfo()

  const { push, query, pathname } = useRouter()

  const { data: country, isLoading } = useQuery({
    queryKey: [newsApi.getCountry.name],
    queryFn: newsApi.getCountry,
  })

  const hidden = () => {
    setShow(false)
  }

  const handleClick = async (news: NewsData) => {
    try {
      if (!pathname.startsWith(Routes.Create)) {
        push(
          `${Routes.Create}?title=${encodeURIComponent(
            news.title.query
          )}&description=`
        )
        return
      }
      if (formData) {
        getAIMemeInfo(
          news.title.query,
          news.articles[0].snippet,
          (data) => {
            formData.form.setValue(formData.formFields.fullname, data?.name)
            formData.form.setValue(
              formData.formFields.description,
              data?.description
            )
          },
          (data) => {
            formData.form.setValue(formData.formFields.logo, data?.[0])
          }
        )
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const { data: news, isFetching } = useQuery({
    queryKey: [newsApi.getNews.name],
    queryFn: () => {
      return newsApi.getNews()
    },
  })

  return {
    show,
    loading,
    loadingCountry: isLoading,
    newsList: news?.data?.results,
    countryList: country?.data,
    isFetching,
    handleClick,
    hidden,
    isLoadingMemeImg,
    isLoadingMemeInfo,
  }
}
