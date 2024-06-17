export const utilTime = {
  wait(time: number = 1500) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(null)
      }, time)
    })
  },

  isPast(date: number | string | Date) {
    if (typeof date === 'number') {
      date = Math.floor(date * 1000)
    }
    console.log(new Date(date).getTime(), new Date().getTime())

    return new Date(date).getTime() < new Date().getTime()
  },
}
