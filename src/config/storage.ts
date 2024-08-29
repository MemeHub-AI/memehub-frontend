export const storageNamespace = 'memehub'

// Don't use `interface`
export type LocalStorage = {
  lang: string
  token: string
  area: string
  comment_trade_tab: string
  show_age: string
  chart_interval: string
  slippage: string
  airdrop_checked: string
  only_graduated_checked: string
}

// Don't use `interface`
export type SessionStorage = {
  invite_code: string
}
