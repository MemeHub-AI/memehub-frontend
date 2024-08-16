import { isEmpty } from 'lodash'

import { WSMessageBase, WSMessageType } from './types'

const baseUrl = process.env.NEXT_PUBLIC_WS_URL

export const wsApiUrl = {
  tradeLogs: baseUrl + '/chat/trade_log',
  tokenInfo: baseUrl + '/chat/coin_info',
  tradeRecord: baseUrl + '/chat/trade_record',

  candlestick: baseUrl + '/ws/v2/coin/candles',
  trades: baseUrl + '/ws/v2/coin/trades',
}

export const heartbeat = {
  message: JSON.stringify({
    type: 'heartbeat',
    message: 'ping',
    data: null,
  }),
  interval: 5_000,
}

export const isSuccessMessage = <T = null>(
  value?: string | WSMessageBase<T>
) => {
  if (!value || isEmpty(value)) return false

  const message =
    typeof value === 'string' ? (JSON.parse(value) as WSMessageBase<T>) : value
  return (
    message.type === 'message' &&
    message.message === 'success' &&
    message.data !== null
  )
}

export const isUpdateMessage = <T = null>(
  value?: string | WSMessageBase<T>
) => {
  if (!value || isEmpty(value)) return false

  const message =
    typeof value === 'string' ? (JSON.parse(value) as WSMessageBase<T>) : value
  return (
    message.type === 'update' &&
    message.message === 'success' &&
    message.data !== null
  )
}

export const isDisconnectMessage = <T = null>(
  value?: string | WSMessageBase<T>
) => {
  if (!value || isEmpty(value)) return false

  const message =
    typeof value === 'string' ? (JSON.parse(value) as WSMessageBase<T>) : value
  return message.type === WSMessageType.ConnectInvalid
}
