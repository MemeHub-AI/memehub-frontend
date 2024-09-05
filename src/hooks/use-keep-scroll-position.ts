import { useEffect } from 'react'
import { useRouter } from 'next/router'

import { useLruMap } from './use-lru-map'

export const useKeepScrollPosition = () => {
  const router = useRouter()
  const position = useLruMap()

  useEffect(() => {
    const onChangeStart = () => {
      // You must use the default value 0 instead of an if statement;
      // otherwise, after sliding down, scrolling back to the top with `window.scrollTo(0, 0)`,
      // switching routes again will cause an error.
      position.set(router.asPath, window.scrollY || 0)
    }

    const onChangeEnd = () => {
      const scrollY = position.get(router.asPath)
      // Same as `position.set`, use the default value 0.
      window.scrollTo(0, scrollY || 0)
    }

    router.events.on('routeChangeStart', onChangeStart)
    router.events.on('routeChangeComplete', onChangeEnd)

    return () => {
      router.events.off('routeChangeStart', onChangeStart)
      router.events.off('routeChangeComplete', onChangeEnd)
    }
  }, [router])
}
