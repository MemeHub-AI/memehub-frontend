import { useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import { isEmpty } from 'lodash'

import {
  heartbeat,
  isSuccessMessage,
  isDisconnectMessage,
  wsApiURL,
  isUpdateMessage,
} from '@/api/websocket'
import {
  WSMessageBase,
  WSMessageType,
  WSTradeRecordMessage,
} from '@/api/websocket/types'
import { useTradeSearchParams } from './use-search-params'
import { useTokenContext } from '@/contexts/token'

export const useTradeRecord = () => {
  const [tradeRecords, setTradeRecords] = useState<WSTradeRecordMessage[]>([])
  const { chainName, tokenAddr } = useTradeSearchParams()
  const { isNotFound } = useTokenContext()

  const { lastJsonMessage, sendJsonMessage, getWebSocket } = useWebSocket<
    WSMessageBase<WSTradeRecordMessage[] | null>
  >(
    isNotFound ? '' : wsApiURL.tradeRecord,
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
    if (!lastJsonMessage || !lastJsonMessage.data) return

    setTradeRecords((records) => {
      const merged = [...(lastJsonMessage.data ?? []), ...records]

      return merged.reduce((acc, cur) => {
        const isExisted = acc.find((r) => r.hash === cur.hash)
        if (!isExisted) acc.push(cur)

        return acc
      }, [] as WSTradeRecordMessage[])
    })
  }, [lastJsonMessage])

  return {
    tradeRecords,
  }
}
