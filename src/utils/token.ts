import { LISTED_STATUS } from '@/constants/token'

// Token is listed on dex.
export const isListed = (s: number | undefined) => {
  if (!s) return false
  return s === LISTED_STATUS
}
