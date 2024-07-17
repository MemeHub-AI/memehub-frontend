import { TradeType } from '@/constants/trade'
import { TokenListItem } from '../token/types'

export interface WSMessageBase<T = null> {
  type: string
  message: string
  data: T
  extra: {
    hasmore: boolean
  }
}

export enum WSMessageType {
  Message = 'message',
  Error = 'error',
  Heartbeat = 'heartbeat',
  ConnectInvalid = 'connect_invalid',
}

export interface WSTradeLogMessage {
  create_info: CreateInfoLog[]
  trade_info: TradeInfoLog[]
}

export interface CreateInfoLog extends TokenListItem {}

export interface TradeInfoLog {
  user_id: number
  logo: string
  name: string
  wallet_address: string
  quote_amount: string
  quote_address: string
  quote_symbol?: string
  quoto_symbol: string
  base_symbol: string
  base_address: string
  coin_logo: string
  chain_id: string
  chain_name: string
  chain_logo: string
  explorer: string
  type: TradeType
}

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
  usd_price: string
}

export interface WSTradeInfoMessage {
  market_cap: number
  holders: {
    address: string
    percentage: string
    contract_flag: string | null
    scan_url: string
  }[]
}
