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
  listen: DatafeedEventBase<'listen', DatafeedBar[]>
  update: DatafeedEventBase<'update', DatafeedBar[]>
  history: DatafeedEventBase<'history', DatafeedBar[]>
  connect_invalid: DatafeedEventBase<'connect_invalid'>
}

export interface DatafeedEmitListen {
  interval: string
  token_address: string
  chain: string
}

export interface DatafeedEmitHistory extends DatafeedEmitListen {
  start: number
  limit: number
}

export interface DatafeedEmitEvents {
  listen: DatafeedEventBase<'listen', DatafeedEmitListen>
  history: DatafeedEventBase<'history', DatafeedEmitHistory>
}
