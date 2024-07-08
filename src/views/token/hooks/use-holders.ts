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
  const { marketCap, holders, setHolders, setMarketCap } = useHoldersStore()

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

  useEffect(() => {
    if (lastJsonMessage?.type === WSMessageType.ConnectInvalid) {
      return getWebSocket()?.close()
    }
    const { market_cap = 0, holders = [] } = lastJsonMessage?.data ?? {}

    // Make sure that data will not be reset to zero/empty
    // once it is available.
    if (marketCap !== 0) setMarketCap(market_cap)
    if (!isEmpty(holders)) setHolders(holders)
  }, [lastJsonMessage])

  return {
    marketCap,
    holders,
  }
}
