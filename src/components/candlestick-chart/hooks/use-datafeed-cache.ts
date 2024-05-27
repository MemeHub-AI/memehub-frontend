import { VoidFn } from '@/utils/types'

let subCache: Record<string, VoidFn> = {}

export const useDatafeedCache = () => {
  return {
    getSub: (uid: string) => subCache[uid],
    setSub: (uid: string, fn: VoidFn) => (subCache[uid] = fn),
    removeSub: (uid: string) => delete subCache[uid],
    clearSub: () => (subCache = {}),
  }
}
