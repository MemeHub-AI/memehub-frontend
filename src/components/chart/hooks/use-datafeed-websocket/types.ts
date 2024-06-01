export interface DatafeedEventBase<T extends string, D = null> {
  type: T
  message?: string
  data: D
}

export interface DatafeedBar {
  timestamp: number
  open: number
  close: number
  high: number
  low: number
  volume: number
}

export interface DatafeedOnEvents {
  listen: DatafeedEventBase<'listen', DatafeedBar[]>
  update: DatafeedEventBase<'update', DatafeedBar[]>
  history: DatafeedEventBase<'history', DatafeedBar[]>
}

export interface DatafeedEmitListen {
  interval: string
  token_address: string
}

export interface DatafeedEmitHistory extends DatafeedEmitListen {
  start: number
  limit: number
}

export interface DatafeedEmitEvents {
  listen: DatafeedEventBase<'listen', DatafeedEmitListen>
  history: DatafeedEventBase<'history', DatafeedEmitHistory>
}
