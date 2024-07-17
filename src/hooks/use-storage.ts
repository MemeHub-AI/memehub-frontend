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

    getToken: () => get('token'),
    setToken: (v: string) => set('token', v),

    getArea: () => get('area') || '24',
    setArea: (v: string) => set('area', v),

    getChain: () => get('chain') || '534352',
    setChain: (v: string) => set('chain', v),

    getCommentTradeTab: () => get('comment_trade_tab'),
    setCommentTradeTab: (v: string) => set('comment_trade_tab', v),

    getTableShowAge: () => get('show_age'),
    setTableShowAge: (v: string) => set('show_age', v),

    // c === chain, a === address
    getInterval: (c: string, a: string) => get(`${c}.${a}`),
    setInterval: (c: string, a: string, i: string) => set(`${c}.${a}`, i),

    getSlippage: () => get('slippage'),
    setSlippage: (v: string) => set('slippage', v),

    getInviteCode: () => get('invite_code'),
    setInviteCode: (v: string) => set('invite_code', v),
  }
}
