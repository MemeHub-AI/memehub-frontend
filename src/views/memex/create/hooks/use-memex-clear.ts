import { useEffect } from 'react'
import { useRouter } from 'next/router'

import { Routes } from '@/routes'
import { useMemexStore } from '@/stores/use-memex'

interface Options {
  type?: 'tweet' | 'details' | 'all'
  onClear?: (pathname: string) => void
}

// Clear memex store
export const useMemexClear = ({ type = 'all', onClear }: Options = {}) => {
  const router = useRouter()
  const { setPost: setTweet, setPostDetails: setTweetDetails } = useMemexStore()

  const clear = () => {
    if (type === 'tweet') return setTweet(null)
    if (type === 'details') return setTweetDetails(null)

    setTweet(null)
    setTweetDetails(null)
  }

  const onRouteChangeStart = (pathname: string) => {
    if (
      pathname === Routes.MemexCreate ||
      pathname === Routes.MemexCreateDetail
    ) {
      return
    }

    clear()
    onClear?.(pathname)
  }

  useEffect(() => {
    router.events.on('routeChangeStart', onRouteChangeStart)

    return () => {
      router.events.off('routeChangeStart', onRouteChangeStart)
    }
  }, [])

  return {
    clear,
  }
}
