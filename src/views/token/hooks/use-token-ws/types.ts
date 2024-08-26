import { WsReceived } from '@/api/types'
import { TradeType } from '@/enums/trade'

export interface TokenEmitEvents {
  listen: TokenSendListen
  unlisten: null
  history: TokenSendListen
}

interface TokenSendListen {
  chain: string
  token: string
  offset?: number
  limit?: number
}

export type TokenOnEvents = WsReceived<{
  trades: [TokenTrade[], TradesExtra]
  holders: [TokenHolder[]]
  price: [TokenTradePrice]
  'all-trades': [TokenTrade[]]
  'all-coin-created': [TokenCreate]
  update: [TokenOnEvents[keyof Omit<TokenOnEvents, 'update'>]]
}>

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
  image_url: string
}

export interface TokenHolder {
  chain: string
  token: string
  holder: string
  amount: string
  flag: string | null
}

export interface TokenTradePrice {
  symbol: string
  price: string
}

export interface TokenCreate {
  chain: string
  coin_type: number
  contract_address: string
  id: string
  image_url: string
  name: string
  symbol: string
}
