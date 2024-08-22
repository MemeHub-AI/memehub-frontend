import { WsReceived } from '@/api/types'
import { TradeType } from '@/enums/trade'

export interface TokenEmitEvents {
  listen: WsSendListen
  unlisten: null
  history: WsSendListen
}

interface WsSendListen {
  chain: string
  token: string
  offset?: number
  limit?: number
}

export interface TokenOnEvents {
  trades: WsReceived<TokenTrade[], 'trades', TradesExtra>
  holders: WsReceived<TokenHolder[], 'holders'>
  price: WsReceived<TokenPrice, 'price'>
  update: WsReceived<TokenOnEvents[keyof Omit<TokenOnEvents, 'update'>]>
}

interface TradesExtra {
  hasmore: boolean
  rewarded: string
}

export interface TokenTrade {
  timestamp: number
  chain: string
  hash: string
  network: string
  executor: string
  base_address: string
  base_symbol: string
  base_amount: string
  quote_address: string
  quote_symbol: string
  quote_amount: string
  type: TradeType
  price: string
  usd_price: string
  marketcap: string
}

export interface TokenHolder {
  chain: string
  token: string
  holder: string
  amount: string
  flag: string | null
}

export interface TokenPrice {
  symbol: string
  price: string
}
