import { useEffect, useState } from 'react'

export const useMounted = (
  onMounted?: VoidFunction,
  onUnmounted?: VoidFunction
) => {
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
