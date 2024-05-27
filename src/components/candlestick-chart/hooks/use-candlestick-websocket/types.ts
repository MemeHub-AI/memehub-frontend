export interface CandlestickEventBase<T extends string, D = null> {
  type: T
  message?: string
  data: D
}

export interface CandlestickBar {
  timestamp: number
  open: number
  close: number
  high: number
  low: number
  volume: number
}

export interface CandlestickOnEvents {
  listen: CandlestickEventBase<'listen', CandlestickBar[]>
  update: CandlestickEventBase<'update', CandlestickBar[]>
  history: CandlestickEventBase<'history', CandlestickBar[]>
}

export interface CandlestickEmitListen {
  interval: string
  token_address: string
}

export interface CandlestickEmitHistory extends CandlestickEmitListen {
  start: number
  limit: number
}

export interface CandlestickEmitEvents {
  listen: CandlestickEventBase<'listen', CandlestickEmitListen>
  history: CandlestickEventBase<'history', CandlestickEmitHistory>
}
