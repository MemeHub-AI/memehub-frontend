import { useEffect, useState } from 'react'

import { VoidFn } from '@/utils/types'

export const useMounted = (onMounted?: VoidFn, onUnmounted?: VoidFn) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    onMounted?.()

    return onUnmounted
  }, [])

  return {
    isMounted,
    isNotMounted: !isMounted,
  }
}
