import { useEffect } from 'react'
import useWebSocket from 'react-use-websocket'
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
import { useTradeSearchParams } from './use-search-params'
import { useTokenContext } from '@/contexts/token'

export const useHolders = () => {
  const { marketCap, holders, setHolders, setMarketCap } = useHoldersStore()
  const { chainName, tokenAddr } = useTradeSearchParams()
  const { isNotFound } = useTokenContext()

  const { lastJsonMessage, sendJsonMessage, getWebSocket } =
    useWebSocket<WSMessageBase<WSTradeInfoMessage> | null>(
      isNotFound ? '' : wsApiURL.tokenInfo,
      {
        heartbeat,
        onOpen: () => {
          if (isEmpty(chainName) || isEmpty(tokenAddr)) return

          sendJsonMessage({
            type: 'message',
            data: {
              chain: chainName,
              token_address: tokenAddr,
            },
          })
        },
        filter: ({ data }) =>
          isSuccessMessage(data) ||
          isUpdateMessage(data) ||
          isDisconnectMessage(data),
        shouldReconnect: () => true,
      },
      !isNotFound
    )

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
