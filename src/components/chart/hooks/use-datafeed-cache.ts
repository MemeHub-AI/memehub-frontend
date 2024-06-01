import { Bar } from '../../../../public/js/charting_library/charting_library'
import { VoidFn } from '@/utils/types'

const cache: Record<string, any | undefined> = {}
let subCache: Record<string, VoidFn> = {}

type Result<T> = T | undefined

export const useDatafeedCache = () => {
  return {
    // Cached bars.
    getBars: () => cache['bars'] as Result<Bar[]>,
    setBars: (bars: Bar[]) => (cache['bars'] = bars),

    // Cached last bar.
    getLastBar: () => cache['last_bar'] as Result<Bar>,
    setLatBar: (bar: Bar | undefined) => (cache['last_bar'] = bar),

    // Cached subscribe.
    getSub: (uid: string) => subCache[uid],
    setSub: (uid: string, fn: VoidFn) => (subCache[uid] = fn),
    removeSub: (uid: string) => delete subCache[uid],
    clearSub: () => (subCache = {}),
  }
}
