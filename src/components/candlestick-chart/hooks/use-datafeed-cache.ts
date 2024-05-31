import { Bar } from '../../../../public/js/charting_library/charting_library'
import { VoidFn } from '@/utils/types'

const cache: Record<string, any | undefined> = {}
let subCache: Record<string, VoidFn> = {}

export const useDatafeedCache = () => {
  return {
    // Normal cache.
    getBars: () => cache['bars'] as Bar[] | undefined,
    setBars: (bars: Bar[]) => (cache['bars'] = bars),

    // Subscribe cache.
    getSub: (uid: string) => subCache[uid],
    setSub: (uid: string, fn: VoidFn) => (subCache[uid] = fn),
    removeSub: (uid: string) => delete subCache[uid],
    clearSub: () => (subCache = {}),
  }
}
