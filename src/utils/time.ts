export const utilTime = {
  wait(time: number = 1500) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(null)
      }, time)
    })
  },
}
