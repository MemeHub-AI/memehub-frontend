import { useEffect } from 'react'
import useWebSocket from 'react-use-websocket'
import { useRouter } from 'next/router'
import { isEmpty } from 'lodash'

import {
  WSMessageType,
  type WSMessageBase,
  type WSTradeInfoMessage,
} from '@/api/websocket/types'

import {
  heartbeat,
  isSuccessMessage,
  isDisconnectMessage,
  wsApiURL,
  isUpdateMessage,
} from '@/api/websocket'
import { useHoldersStore } from '@/stores/use-holders-store'

export const useHolders = () => {
  const { query } = useRouter()
  const { setHolders, setMarketCap } = useHoldersStore()

  const { lastJsonMessage, sendJsonMessage, getWebSocket } =
    useWebSocket<WSMessageBase<WSTradeInfoMessage> | null>(wsApiURL.tokenInfo, {
      heartbeat,
      onOpen: () => {
        const token_address = query.address || ''
        const chain = query.chain || ''

        if (isEmpty(token_address)) return
        if (isEmpty(chain)) return

        sendJsonMessage({
          type: 'message',
          data: { token_address, chain },
        })
      },
      filter: ({ data }) =>
        isSuccessMessage(data) ||
        isUpdateMessage(data) ||
        isDisconnectMessage(data),
      shouldReconnect: () => true,
    })

  const marketCap = lastJsonMessage?.data?.market_cap || 0
  const holders = lastJsonMessage?.data?.holders.slice(0, 15) || []

  useEffect(() => {
    if (lastJsonMessage?.type === WSMessageType.ConnectInvalid) {
      return getWebSocket()?.close()
    }
    setMarketCap(marketCap)
    setHolders(holders)
  }, [lastJsonMessage])

  return {
    marketCap,
    holders,
  }
}
