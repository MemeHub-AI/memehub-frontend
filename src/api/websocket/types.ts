export interface WSMessageBase<T = null> {
  type: string
  message: string
  data: T
}

export enum WSMessageType {
  Message = 'message',
  Error = 'error',
  Heartbeat = 'heartbeat',
}

export enum TradeType {
  Buy = 'buy',
  Sell = 'sell',
}

export interface WSTradeLogMessage {
  create_info: CreateInfoLog[]
  trade_info: TradeInfoLog[]
}

export interface CreateInfoLog {}

export interface TradeInfoLog {}

export interface WSTradeRecordMessage {
  chain: string
  account: {
    id: number
    logo: string
    name: string
    wallet_address: string
  }
  type: TradeType
  quote_symbol: string
  quote_amount: number
  base_symbol: string
  base_amount: number
  create_time: string
  hash: string
  hash_url: string
}

export interface WSTradeInfoMessage {
  market_cap: number
  holders: {
    address: string
    percentage: string
    scan_url: string
  }[]
}
