import { WsReceived } from '@/api/types'

export interface DatafeedEmitEvents {
  listen: {
    chain: string
    token: string
    interval: string
  }
  history: {
    start: number
    end: number
  }
  unlisten: null
}

export interface DatafeedOnEvents {
  candles: WsReceived<DatafeedCandles, string, { hasmore: boolean }>
  update: WsReceived<DatafeedOnEvents[keyof Omit<DatafeedOnEvents, 'update'>]>
}

export interface DatafeedCandles {
  master: DatafeedBar[]
  usd: DatafeedBar[]
}

interface DatafeedBar {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface DatafeedCache {
  bars: DatafeedBar[]
  lastBar: DatafeedBar | undefined
}
