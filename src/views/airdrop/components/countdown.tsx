import React, { useState, useEffect } from 'react'

interface CountdownProps {
  targetTimestamp: number
}

export const Countdown = ({ targetTimestamp }: CountdownProps) => {
  const [countdown, setCountdown] = useState({
    hours: '-',
    minutes: '-',
    seconds: '-',
  })

  const formatNumber = (num: number) => {
    return num < 10 ? `0${num}` : `${num}`
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTimestamp = Date.now()

      const timeDifference = targetTimestamp - currentTimestamp

      const hours = formatNumber(Math.floor(timeDifference / (1000 * 60 * 60)))
      const minutes = formatNumber(
        Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))
      )
      const seconds = formatNumber(
        Math.floor((timeDifference % (1000 * 60)) / 1000)
      )
      setCountdown({ hours, minutes, seconds })
      if (timeDifference <= 0) {
        clearInterval(intervalId)
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div>
      <p>
        {countdown.hours}:{countdown.minutes}:{countdown.seconds}
      </p>
    </div>
  )
}
