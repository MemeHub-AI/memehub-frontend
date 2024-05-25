export const utilColor = {
  randomCreate() {
    const colors = []
    for (let i = 0; i < 8; i++) {
      const red = Math.floor(Math.random() * 128 + 127).toString(16)
      const green = Math.floor(Math.random() * 128 + 127).toString(16)
      const blue = Math.floor(Math.random() * 128 + 127).toString(16)
      colors.push(`#${red}${green}${blue}`)
    }
    return colors
  },
}
