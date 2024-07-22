import React, {
  useState,
  useEffect,
  useMemo,
  ComponentProps,
  ReactNode,
  useRef,
} from 'react'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

interface Props extends Omit<ComponentProps<'p'>, 'prefix'> {
  /** unit is seconds */
  createdAt: number
  /** unit is seconds */
  duration: number
  onExpired?: (value: boolean) => void
  expiredText?: string
  keepZero?: boolean
  prefix?: ReactNode
  onInitExpired?: (value: boolean) => void
}

export const Countdown = ({
  className,
  createdAt,
  duration,
  expiredText,
  keepZero,
  prefix,
  onExpired,
  onInitExpired,
}: Props) => {
  const { t } = useTranslation()
  const [countdown, setCountdown] = useState('')
  const [isExpired, setIsExpired] = useState(false)
  const targetTime = useMemo(() => {
    const createTime = dayjs.unix(createdAt).add(duration, 'second')
    return createTime
  }, [createdAt, duration])
  const timerRef = useRef<NodeJS.Timeout>()

  const updateCountdown = () => {
    if (createdAt <= 0 || duration <= 0) {
      onInitExpired?.(true)
      clearInterval(timerRef.current)
      return
    }

    const currentTime = dayjs()
    const diff = targetTime.diff(currentTime, 'second')
    const h = String(Math.floor(diff / 3600)).padStart(2, '0')
    const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0')
    const s = String(diff % 60).padStart(2, '0')

    const formattedCountdown = `${h}h: ${m}m: ${s}s`
    setCountdown(formattedCountdown)

    if (diff <= 0) {
      setIsExpired(true)
      onExpired?.(true)
      clearInterval(timerRef.current)
    }
  }

  useEffect(() => {
    updateCountdown()
    timerRef.current = setInterval(updateCountdown, 1_000)

    return () => {
      clearInterval(timerRef.current)
    }
  }, [createdAt, duration])

  if (isExpired && !keepZero) {
    return (
      <p className={cn('text-zinc-500', className)}>
        {prefix} {expiredText ?? t('expired')}
      </p>
    )
  }

  return (
    <p className={cn('text-red-600 font-bold whitespace-nowrap', className)}>
      {prefix} {keepZero ? '0h: 0m: 0s' : countdown}
    </p>
  )
}
