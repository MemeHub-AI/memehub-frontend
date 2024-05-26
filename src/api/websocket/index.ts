import { WSMessageBase } from './types'

const baseURL = process.env.NEXT_PUBLIC_WS_URL

export const wsApiURL = {
  tradeLogs: baseURL + '/chat/trade_log',
  tokenInfo: baseURL + '/chat/coin_info',
  tradeRecord: baseURL + '/chat/trade_record',
}

export const heartbeat = {
  message: JSON.stringify({
    type: 'heartbeat',
    message: 'ping',
    data: null,
  }),
  interval: 5_000,
}

export const isSuccessMessage = <T extends WSMessageBase<any>>(message?: T) => {
  if (!message) return false
  return message.type === 'message' && message.message === 'success'
}
