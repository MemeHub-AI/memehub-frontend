interface Storages<T = string> {
  lang: T
  token: T
}

type Keys = keyof Storages

const withNs = (name: string) => `memehub::${name}`

// TODO/low: refactor to type safe
export const useStorage = (useSession = false) => {
  const storage =
    typeof window !== 'undefined'
      ? useSession
        ? sessionStorage
        : localStorage
      : undefined

  const get = (k: string) => storage?.getItem(withNs(k))

  const set = (k: string, v: string) => storage?.setItem(withNs(k), v)

  const remove = (k: string) => storage?.removeItem(withNs(k))

  const clear = () => storage?.clear()

  // Type safe refactoring...
  const getStorage = <T extends Keys = Keys>(k: T) =>
    storage?.getItem(withNs(k)) as Storages[T]

  const setStorage = <T extends Keys = Keys>(k: T, v: Storages[T]) =>
    storage?.setItem(withNs(k), v)

  const removeStorage = (k: Keys) => storage?.removeItem(withNs(k))

  const clearStorage = () => storage?.clear()

  return {
    get,
    set,
    remove,
    clear,

    getLang: () => get('lang'),
    setLang: (v: string) => set('lang', v),

    getToken: () => get('token'),
    setToken: (v: string) => set('token', v),

    getArea: () => get('area') || '24',
    setArea: (v: string) => set('area', v),

    getCommentTradeTab: () => get('comment_trade_tab'),
    setCommentTradeTab: (v: string) => set('comment_trade_tab', v),

    getTableShowAge: () => get('show_age'),
    setTableShowAge: (v: string) => set('show_age', v),

    getChartInterval: () => get('chart_interval'),
    setChartInterval: (v: string) => set('chart_interval', v),

    getSlippage: () => get('slippage'),
    setSlippage: (v: string) => set('slippage', v),

    getInviteCode: () => get('invite_code'),
    setInviteCode: (v: string) => set('invite_code', v),

    getMainChain: () => get('main_chain'),
    setMainChain: (v: 'evm' | 'solana' | 'ton') => set('main_chain', v),
    removeMainChain: () => remove('main_chain'),

    getAirdropChecked: () => get('airdrop_checked'),
    setAirdropChecked: (v: string) => set('airdrop_checked', v),
  }
}
