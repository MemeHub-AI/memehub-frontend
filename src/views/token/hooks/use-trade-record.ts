import { useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import { useRouter } from 'next/router'
import { isEmpty } from 'lodash'

import { heartbeat, isSuccessMessage, wsApiURL } from '@/api/websocket'
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
    filter: (message) => isSuccessMessage(message.data),
  })

  useEffect(() => {
    if (!lastJsonMessage || !lastJsonMessage.data) return

    setTradeRecords((records) => [...lastJsonMessage.data!, ...records])
  }, [lastJsonMessage])

  return {
    tradeRecords,
  }
}
