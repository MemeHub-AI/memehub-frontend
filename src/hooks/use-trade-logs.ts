import { useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import { last } from 'lodash'

import type {
  CreateInfoLog,
  TradeInfoLog,
  WSMessageBase,
  WSTradeLogMessage,
} from '@/api/websocket/types'

import { heartbeat, isSuccessMessage, wsApiURL } from '@/api/websocket'

export const useTradeLogs = () => {
  const [isLatest, setIsLatest] = useState(false)
  const [lastTrade, setLastTrade] = useState<TradeInfoLog>()
  const [lastCreate, setLastCreate] = useState<CreateInfoLog>()

  const { lastJsonMessage, sendJsonMessage } =
    useWebSocket<WSMessageBase<WSTradeLogMessage> | null>(wsApiURL.tradeLogs, {
      heartbeat,
      onOpen: () => {
        sendJsonMessage({ type: 'message', data: null })
      },
    })

  useEffect(() => {
    if (!lastJsonMessage) return
    if (!isSuccessMessage(lastJsonMessage)) return
    const { trade_info, create_info } = lastJsonMessage.data

    setIsLatest(true)
    setLastTrade(last(trade_info))
    setLastCreate(last(create_info))
  }, [lastJsonMessage])

  useEffect(() => {
    if (isLatest) {
      setTimeout(() => setIsLatest(false), 2_000)
    }
  }, [isLatest])

  return {
    isLatest,
    lastTrade,
    lastCreate,
  }
}
