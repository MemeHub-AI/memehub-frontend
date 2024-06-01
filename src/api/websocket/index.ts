import { isEmpty } from 'lodash'

import { WSMessageBase } from './types'

const baseURL = process.env.NEXT_PUBLIC_WS_URL

export const wsApiURL = {
  tradeLogs: baseURL + '/chat/trade_log',
  tokenInfo: baseURL + '/chat/coin_info',
  tradeRecord: baseURL + '/chat/trade_record',
  chart: baseURL + '/chat/k_line',
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
