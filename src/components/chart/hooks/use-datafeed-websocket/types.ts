export interface DatafeedEventBase<T extends string, D = null> {
  type: T
  message?: string
  data: DatafeedBaseData<D>
}

export interface DatafeedBaseData<T = null> {
  master: T
  usd: T
}

export interface DatafeedBar {
  time: number
  open: number
  close: number
  high: number
  low: number
  volume?: number
}

export interface DatafeedOnEvents {
  candles: DatafeedEventBase<'listen', DatafeedBar[]>
  update: DatafeedEventBase<
    'update',
    DatafeedEventBase<'candles', DatafeedBaseData<DatafeedBar[]>>
  >
  connect_invalid: DatafeedEventBase<'connect_invalid'>
}

export interface DatafeedEmitEvents {
  listen: DatafeedEventBase<'listen', DatafeedEmitListen>
  history: DatafeedEventBase<'history', DatafeedEmitHistory>
  // unlisten:
}

export interface DatafeedEmitListen {
  chain: string
  token: string
  interval: string
}

export interface DatafeedEmitHistory {
  start: number
  end: number
}
