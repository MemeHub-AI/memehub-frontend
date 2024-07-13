import { random } from 'lodash'

export const randomBy = <T = unknown>(arr: T[] = []) => {
  const n = random(0, arr.length - 1, false)
  return arr[n]
}
