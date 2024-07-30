import { useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'

export const useRemainingTime = (endAt: number) => {
  const [isExpired, setIsExpired] = useState(false)
  const timerRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    timerRef.current = setInterval(() => {
      const remaining = endAt - dayjs().unix()
      if (remaining <= 0) {
        setIsExpired(true)
        clearInterval(timerRef.current)
      }
    }, 1_000)

    return () => {
      clearInterval(timerRef.current)
    }
  }, [endAt])

  return {
    isExpired,
  }
}
