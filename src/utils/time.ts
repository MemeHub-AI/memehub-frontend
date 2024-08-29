import dayjs from 'dayjs'

import { utilLang } from './lang'

export const utilTime = {
  wait: (time: number = 1500) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(null)
      }, time)
    })
  },
  isPast: (ts: number, duration: number) => {
    const remainTime = dayjs().unix() - ts
    return remainTime >= duration
  },
  isUtcOffset8: () => dayjs().utcOffset() / 60,
}

export const simplifyFromNow = (date: string | undefined) => {
  const day = dayjs(date).fromNow(true)

  if (utilLang.isEn()) {
    return day
      .replace('day', 'd')
      .replace('ds', 'd')
      .replace('hour', 'h')
      .replace('hs', 'h')
      .replace('minute', 'm')
      .replace('ms', 'm')
      .replace('second', 's')
      .replace('ss', 's')
  }

  return day
}
