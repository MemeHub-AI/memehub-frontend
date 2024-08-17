import { useRef } from 'react'

import { ObjectLike } from '@/utils/types'

// Least recently used map, type safe & save memory.
export const useLruMap = <T extends ObjectLike<any>>(maxSize = 8192) => {
  const mapRef = useRef(new Map<keyof T, T[keyof T]>())

  const get = <K extends keyof T>(k: K) =>
    mapRef.current.get(k) as T[K] | undefined

  const set = <K extends keyof T>(k: K, v: T[K]) => {
    const map = mapRef.current
    if (map.size > maxSize) {
      map.delete(map.keys().next().value)
    }
    map.set(k, v)
  }

  return {
    ...mapRef.current,
    get,
    set,
  }
}
