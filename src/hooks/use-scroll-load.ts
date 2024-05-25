import { useEffect, useState } from 'react'
import { useWindowScroll } from 'react-use'

import type { VoidFn } from '@/utils/types'

interface Options {
  onFetchNext?: VoidFn
  hasMore?: boolean
}

export const useScrollLoad = (options: Options) => {
  const { onFetchNext, hasMore } = options
  const [isCalled, setIsCalled] = useState(false)
  const { y } = useWindowScroll()
  const { scrollHeight, clientHeight } = document.documentElement
  const totalScrollHeight = scrollHeight - clientHeight

  useEffect(() => {
    if (!hasMore) return
    if (y !== totalScrollHeight) return

    onFetchNext?.()
    !isCalled && setIsCalled(true)
  }, [y])

  return {
    noMore: isCalled && !hasMore,
  }
}
