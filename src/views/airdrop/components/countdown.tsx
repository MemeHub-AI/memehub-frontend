import React, { useState, useEffect } from 'react'

interface CountdownProps {
  targetTimestamp: number
}

export const Countdown = ({ targetTimestamp }: CountdownProps) => {
  const [countdown, setCountdown] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00',
  })

  const formatNumber = (num: number) => {
    return num < 10 ? `0${num}` : `${num}`
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTimestamp = Date.now()
      const endTime = 48 * 60 * 60 * 1000
      const timeDifference = currentTimestamp - targetTimestamp

      const hours = formatNumber(Math.floor((endTime - timeDifference) / (1000 * 60 * 60)))
      const minutes = formatNumber(
        Math.floor(((endTime - timeDifference) % (1000 * 60 * 60)) / (1000 * 60))
      )
      const seconds = formatNumber(
        Math.floor(((endTime - timeDifference) % (1000 * 60)) / 1000)
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
      <p className="text-[#CF1322] font-bold">
        {countdown.hours}:{countdown.minutes}:{countdown.seconds}
      </p>
    </div>
  )
}
