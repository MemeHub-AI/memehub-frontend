const baseUrl = process.env.NEXT_PUBLIC_WS_URL

export const wsApiUrl = {
  tradeLogs: baseUrl + '/chat/trade_log',
  tokenInfo: baseUrl + '/chat/coin_info',
  tradeRecord: baseUrl + '/chat/trade_record',

  candlestick: baseUrl + '/ws/v2/coin/candles',
  trades: baseUrl + '/ws/v2/coin/trades',
}
