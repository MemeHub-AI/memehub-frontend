import {
  storageNamespace,
  LocalStorage,
  SessionStorage,
} from '@/config/storage'

const withNs = (key: string) => `${storageNamespace}::${key}`

const useStorage = <S extends Record<string, string>>(
  storage: Storage | undefined
) => {
  const getStorage = <T extends keyof S = keyof S>(k: T & string) =>
    storage?.getItem(withNs(k)) as S[T] | undefined

  const setStorage = <T extends keyof S = keyof S>(k: T & string, v: S[T]) =>
    storage?.setItem(withNs(k), v)

  const removeStorage = (k: keyof S & string) => storage?.removeItem(withNs(k))

  const clearStorage = () => storage?.clear()

  return {
    getStorage,
    setStorage,
    removeStorage,
    clearStorage,
  }
}

export const useLocalStorage = () => {
  return useStorage<LocalStorage>(
    typeof window !== 'undefined' ? localStorage : undefined
  )
}

export const useSessionStorage = () => {
  return useStorage<SessionStorage>(
    typeof window !== 'undefined' ? sessionStorage : undefined
  )
}
