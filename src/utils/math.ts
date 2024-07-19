import { random } from 'lodash'

export const randomBy = <T = unknown>(arr: T[] = []) => {
  if (arr.length === 0) return
  if (arr.length === 1) return arr[0]

  const n = random(0, arr.length - 1, false)
  return arr[n]
}
