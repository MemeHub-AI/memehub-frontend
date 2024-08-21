import { useEffect } from 'react'
import { useRouter } from 'next/router'

import { Routes } from '@/routes'
import { useMemexStore } from '@/stores/use-memex'

interface Options {
  type?: 'idea' | 'details' | 'all'
  onClear?: (pathname: string) => void
}

// Clear memex store
export const useCreateIdeaCleanup = ({
  type = 'all',
  onClear,
}: Options = {}) => {
  const router = useRouter()
  const { setIdea, setIdeaDetails } = useMemexStore()

  const clear = () => {
    if (type === 'idea') return setIdea(null)
    if (type === 'details') return setIdeaDetails(null)

    setIdea(null)
    setIdeaDetails(null)
  }

  const onRouteChangeStart = (pathname: string) => {
    if (
      pathname === Routes.MemexCreate ||
      pathname === Routes.MemexCreateDetails
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
