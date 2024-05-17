export const useStorage = (useSession = false) => {
  const storage =
    typeof window !== 'undefined'
      ? useSession
        ? sessionStorage
        : localStorage
      : undefined

  const withNs = (name: string) => `memehub::${name}`

  const get = (k: string) => storage?.getItem(withNs(k))

  const set = (k: string, v: string) => storage?.setItem(withNs(k), v)

  const remove = (k: string) => storage?.removeItem(withNs(k))

  const clear = () => storage?.clear()

  return {
    get,
    set,
    remove,
    clear,

    getLang: () => get('lang'),
    setLang: (v: string) => set('lang', v),
  }
}
