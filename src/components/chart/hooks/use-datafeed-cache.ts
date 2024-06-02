import type { Bar } from '../../../../public/js/charting_library/charting_library'
import type { VoidFn } from '@/utils/types'

const cache = new Map<string, any | undefined>()
const subCache = new Map<string, VoidFn>()

export const useDatafeedCache = () => {
  return {
    // Cached bars.
    getBars: () => cache.get('bars') as Bar[] | undefined,
    setBars: (bars: Bar[]) => cache.set('bars', bars),

    // Cached last bar.
    getLastBar: () => cache.get('last_bar') as Bar | undefined,
    setLastBar: (bar: Bar | undefined) => cache.set('last_bar', bar),

    // Cached resolution.
    getResolution: () => cache.get('resolution') as string | undefined,
    setResolution: (r: string) => cache.set('resolution', r),

    // Cached subscribe.
    getSub: (uid: string) => subCache.get(uid),
    setSub: (uid: string, fn: VoidFn) => subCache.set(uid, fn),
    removeSub: (uid: string) => subCache.delete(uid),
    clearSub: () => subCache.clear(),
  }
}
