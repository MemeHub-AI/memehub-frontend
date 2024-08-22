export const strToBool = (str: string | undefined | null) => {
  if (!str) return false

  return str === 'true' ? true : false
}

export const lowerIncludes = (a: string) => {
  const lowerA = a.toLowerCase()
  return (b: string) => {
    const lowerB = b.toLowerCase()
    return lowerA.includes(lowerB)
  }
}
