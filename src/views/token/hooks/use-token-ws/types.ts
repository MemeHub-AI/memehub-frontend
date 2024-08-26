import { WsReceived } from '@/api/types'
import { TradeType } from '@/enums/trade'

export interface TokenWsEmitEvents {
  listen: TokenWsListen
  unlisten: null
  history: TokenWsListen
}

interface TokenWsListen {
  chain: string
  token: string
  offset?: number
  limit?: number
}

export type TokenWsOnEvents = WsReceived<{
  trades: [TokenWsTrade[], TradesExtra]
  holders: [TokenWsHolder[]]
  price: [TokenWsTradePrice]
  'all-trades': [TokenWsTrade[]]
  'all-coin-created': [TokenWsCreate]
  update: [TokenWsOnEvents[keyof Omit<TokenWsOnEvents, 'update'>]]
  'reward-info': [TokenWsRewardInfo]
}>

interface TradesExtra {
  hasmore: boolean
  rewarded: string
}

export interface TokenWsTrade {
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

export interface TokenWsHolder {
  chain: string
  token: string
  holder: string
  amount: string
  flag: string | null
}

export interface TokenWsTradePrice {
  symbol: string
  price: string
}

export interface TokenWsCreate {
  chain: string
  coin_type: number
  contract_address: string
  id: string
  image_url: string
  name: string
  symbol: string
}

export interface TokenWsRewardInfo {
  buy: TokenWsRewardInfoItem
  sell: TokenWsRewardInfoItem
}

interface TokenWsRewardInfoItem {
  amount_unit: number
  usd_unit: number
  desc: string
}
