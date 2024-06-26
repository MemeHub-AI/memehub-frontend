import { useEffect } from 'react'
import useWebSocket from 'react-use-websocket'
import { useRouter } from 'next/router'
import { isEmpty } from 'lodash'

import type { WSMessageBase, WSTradeInfoMessage } from '@/api/websocket/types'

import {
  heartbeat,
  isSuccessMessage,
  isUpdateMessage,
  wsApiURL,
} from '@/api/websocket'
import { useHoldersStore } from '@/stores/use-holders-store'

export const useHolders = () => {
  const { query } = useRouter()
  const { setHolders, setMarketCap } = useHoldersStore()

  const { lastJsonMessage, sendJsonMessage } =
    useWebSocket<WSMessageBase<WSTradeInfoMessage> | null>(wsApiURL.tokenInfo, {
      heartbeat,
      onOpen: () => {
        const token_address = query.address || ''
        if (isEmpty(token_address)) return
        sendJsonMessage({
          type: 'message',
          data: { token_address },
        })
      },
      filter: ({ data }) => isSuccessMessage(data) || isUpdateMessage(data),
      shouldReconnect: () => true,
    })

  const marketCap = lastJsonMessage?.data?.market_cap || 0
  const holders = lastJsonMessage?.data?.holders.slice(0, 10) || []

  useEffect(() => {
    setMarketCap(marketCap)
    setHolders(holders)
  }, [lastJsonMessage])

  return {
    marketCap,
    holders,
  }
}
