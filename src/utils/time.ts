import dayjs from 'dayjs'

export const utilTime = {
  wait(time: number = 1500) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(null)
      }, time)
    })
  },
  isPast(ts: number, duration: number) {
    const remainTime = dayjs().unix() - ts
    return remainTime >= duration
  },
}
