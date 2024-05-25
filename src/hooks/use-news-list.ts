import { newsApi } from '@/api/news'
import { NewsData } from '@/api/news/types'
import { tokenApi } from '@/api/token'
import { CreateTokenResult } from '@/api/token/types'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

export const useNewsList = () => {
  const [show, setShow] = useState(false)
  const [data, setData] = useState<CreateTokenResult>()
  const [loading, setLoading] = useState(false)

  const hidden = () => {
    setShow(false)
  }

  const handleClick = async (news: NewsData) => {
    setShow(!show)
    setLoading(true)
    try {
      const { data } = await tokenApi.generateInfo()
      setData(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const { data: news, isFetching } = useQuery({
    queryKey: ['hot-news'],
    queryFn: () => {
      return newsApi.getNews()
    },
  })

  return {
    data,
    show,
    loading,
    newsList: news?.data?.results,
    isFetching,
    handleClick,
    hidden,
  }
}
