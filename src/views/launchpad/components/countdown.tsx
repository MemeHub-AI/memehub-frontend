import clsx from 'clsx'
import { PropsWithChildren, useEffect, useState } from 'react'
import { useInterval, useTimeout } from 'react-use'

interface Props extends PropsWithChildren {
  className?: string
  time: number | string
  onEnd?: () => void
}

interface PropsItem {
  time: number
}

export const Countdown = ({ className, time }: Props) => {
  const [isEnd, setIsEnd] = useState(false)
  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)

  const TimeItem = ({ time }: PropsItem) => (
    <div className="flex justify-center items-center w-[40px] h-[40px] rounded-md bg-slate-200 text-black p-2">
      {time < 10 ? `0${time}` : time}
    </div>
  )

  const countdown = () => {
    const diff = (new Date(time).getTime() - new Date().getTime()) / 1000

    if (diff <= 0) {
      return setIsEnd(true)
    }

    setDays(Math.floor(diff / (24 * 60 * 60)))
    setHours(Math.floor((diff % (24 * 60 * 60)) / (60 * 60)))
    setMinutes(Math.floor((diff % (60 * 60)) / 60))
    setSeconds(Math.floor(diff % 60))
  }

  useInterval(countdown, 1000)
  useEffect(countdown, [])

  if (isEnd) {
    return <></>
  }

  return (
    <div className={clsx('flex items-center justify-center', className)}>
      <TimeItem time={days}></TimeItem>
      <span className="mx-2">:</span>
      <TimeItem time={hours}></TimeItem>
      <span className="mx-2">:</span>
      <TimeItem time={minutes}></TimeItem>
      <span className="mx-2">:</span>
      <TimeItem time={seconds}></TimeItem>
    </div>
  )
}
