import { useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import { useRouter } from 'next/router'
import { isEmpty } from 'lodash'

import {
  heartbeat,
  isSuccessMessage,
  isUpdateMessage,
  wsApiURL,
} from '@/api/websocket'
import {
  WSMessageBase,
  WSMessageType,
  WSTradeRecordMessage,
} from '@/api/websocket/types'

export const useTradeRecord = () => {
  const { query } = useRouter()
  const [tradeRecords, setTradeRecords] = useState<WSTradeRecordMessage[]>([])

  const { lastJsonMessage, sendJsonMessage, getWebSocket } = useWebSocket<
    WSMessageBase<WSTradeRecordMessage[] | null>
  >(wsApiURL.tradeRecord, {
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

  useEffect(() => {
    if (!lastJsonMessage || !lastJsonMessage.data) return

    if (lastJsonMessage.type === WSMessageType.ConnectInvalid) {
      return getWebSocket()?.close()
    }

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
