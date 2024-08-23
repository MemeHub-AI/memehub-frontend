import { useEffect } from 'react'
import { useRouter } from 'next/router'

import { Routes } from '@/routes'
import { useMemexStore } from '@/stores/use-memex'

interface Options {
  clearOption?: 'idea' | 'details' | 'all'
  onClear?: (pathname: string) => void
}

// Clear memex store
export const useCreateIdeaCleanup = ({
  clearOption = 'all',
  onClear,
}: Options = {}) => {
  const router = useRouter()
  const { setIdea, setIdeaDetails } = useMemexStore()

  const clear = () => {
    if (clearOption === 'idea') return setIdea(null)
    if (clearOption === 'details') return setIdeaDetails(null)

    setIdea(null)
    setIdeaDetails(null)
  }

  const onRouteChangeStart = (pathname: string) => {
    if (
      pathname.includes(Routes.MemexCreate) ||
      pathname.includes(Routes.MemexCreateDetails)
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
