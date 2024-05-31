export const strToBool = (str: string | undefined | null) => {
  if (!str) return false

  return str === 'true' ? true : false
}
