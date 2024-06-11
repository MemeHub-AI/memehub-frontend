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
      date = date * 1000
    }
    return new Date(date) < new Date()
  },
}
