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
import { WSMessageBase, WSTradeRecordMessage } from '@/api/websocket/types'

export const useTradeRecord = () => {
  const { query } = useRouter()
  const [tradeRecords, setTradeRecords] = useState<WSTradeRecordMessage[]>([])

  const { lastJsonMessage, sendJsonMessage } = useWebSocket<
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

    setTradeRecords((records) => {
      const unique = lastJsonMessage.data?.filter((r) =>
        records.some((r2) => r.hash !== r2.hash)
      )
      return unique ?? []
    })
  }, [lastJsonMessage])

  return {
    tradeRecords,
  }
}
