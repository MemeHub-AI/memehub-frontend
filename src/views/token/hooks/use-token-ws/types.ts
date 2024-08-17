import { WsReceived } from '@/api/types'
import { TradeType } from '@/enums/trade'

interface WsPagination {
  offset: number
  limit: number
}

export interface TokenEmitEvents {
  listen: {
    chain: string
    token: string
  } & Partial<WsPagination>
  unlisten: null
  history: WsPagination
}

export interface TokenOnEvents {
  trades: TokenTrade[]
  holders: TokenHolder[]
  price: TokenPrice
  update: WsReceived<Omit<TokenOnEvents, 'update'>, Extract>
}

interface Extract {
  has_more: boolean
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
  flag: string
}

export interface TokenPrice {
  symbol: string
  price: string
}
