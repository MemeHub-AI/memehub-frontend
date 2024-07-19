import React, {
  useState,
  useEffect,
  useMemo,
  ComponentProps,
  ReactNode,
} from 'react'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

interface Props extends Omit<ComponentProps<'p'>, 'prefix'> {
  createdAt: number
  duration: number
  onExpired?: (value: boolean) => void
  expiredText?: string
  keepZero?: boolean
  prefix?: ReactNode
}

export const Countdown = ({
  className,
  createdAt,
  duration,
  expiredText,
  keepZero,
  prefix,
  onExpired,
}: Props) => {
  const { t } = useTranslation()
  const [countdown, setCountdown] = useState('')
  const [isExpired, setIsExpired] = useState(false)
  const targetTime = useMemo(() => {
    const createTime = dayjs.unix(createdAt).add(duration, 'second')
    return createTime
  }, [createdAt, duration])

  const updateCountdown = () => {
    if (createdAt <= 0 || duration <= 0) return

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
      return
    }
    setTimeout(updateCountdown, 1000)
  }

  useEffect(() => {
    updateCountdown()
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
