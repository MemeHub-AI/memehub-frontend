import { Bar } from '../../../../public/js/charting_library/charting_library'
import { VoidFn } from '@/utils/types'

const cache: Record<string, any | undefined> = {}
let subCache: Record<string, VoidFn> = {}

export const useDatafeedCache = () => {
  return {
    // Cached bars.
    getBars: () => cache['bars'] as Bar[] | undefined,
    setBars: (bars: Bar[]) => (cache['bars'] = bars),

    // Cached last bar.
    getLastBar: () => cache['last_bar'] as Bar | undefined,
    setLatBar: (bar: Bar | undefined) => (cache['last_bar'] = bar),

    // Cached resolution.
    getResolution: () => cache['resolution'] as string | undefined,
    setResolution: (resolution: string) => (cache['resolution'] = resolution),

    // Cached subscribe.
    getSub: (uid: string) => subCache[uid],
    setSub: (uid: string, fn: VoidFn) => (subCache[uid] = fn),
    removeSub: (uid: string) => delete subCache[uid],
    clearSub: () => (subCache = {}),
  }
}
