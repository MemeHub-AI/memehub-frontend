import React, { useState, useEffect, useMemo } from 'react'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

interface CountdownProps {
  createdAt: number
  duration: number
  onExpired?: () => void
}

export const Countdown = ({
  createdAt,
  duration,
  onExpired,
}: CountdownProps) => {
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

    const formattedCountdown = `${h}: ${m}: ${s}`
    setCountdown(formattedCountdown)

    if (diff <= 0) {
      setIsExpired(true)
      onExpired?.()
      return
    }
    setTimeout(updateCountdown, 1000)
  }

  useEffect(() => {
    updateCountdown()
  }, [createdAt, duration])

  if (isExpired) {
    return <p className="text-zinc-500">{t('expired')}</p>
  }

  return <p className="text-red-600 font-bold">{countdown}</p>
}
