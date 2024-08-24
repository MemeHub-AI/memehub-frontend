import { useEffect, useState } from 'react'
import { useScroll } from 'ahooks'

interface Options {
  onFetchNext?: VoidFunction
  hasMore?: boolean
}

/** @deprecated should remove */
export const useScrollLoad = (options: Options) => {
  const { onFetchNext, hasMore } = options
  const [isCalled, setIsCalled] = useState(false)
  const { top } = useScroll() ?? { top: 0 }
  const { scrollHeight, clientHeight } = document.documentElement
  const totalScrollHeight = scrollHeight - clientHeight

  useEffect(() => {
    if (!hasMore) return
    if (top !== totalScrollHeight) return

    onFetchNext?.()
    !isCalled && setIsCalled(true)
  }, [top])

  return {
    noMore: isCalled && !hasMore,
  }
}
