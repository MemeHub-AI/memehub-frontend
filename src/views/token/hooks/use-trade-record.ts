import { useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import { useRouter } from 'next/router'
import { isEmpty } from 'lodash'

import { heartbeat, isSuccessMessage, wsApiURL } from '@/api/websocket'
import {
  TradeType,
  WSMessageBase,
  WSTradeRecordMessage,
} from '@/api/websocket/types'

export const useTradeRecord = () => {
  const { query } = useRouter()
  const token_address = query.address || ''
  const [tradeRecords, setTradeRecords] = useState<WSTradeRecordMessage[]>(
    Array.from({ length: 21 }, (_, i) => ({
      account: 'u' + (i + 1),
      base_amount: 1,
      base_symbol: 'string',
      chain: 'string',
      create_time: 'string',
      hash: 'string',
      hash_url: 'string',
      quote_amount: 1,
      quote_symbol: 'string',
      type: TradeType.Buy,
    }))
  )

  const { lastJsonMessage, sendJsonMessage } = useWebSocket<
    WSMessageBase<WSTradeRecordMessage[] | null>
  >(wsApiURL.tradeRecord, {
    heartbeat,
    onOpen: () => {
      if (!token_address || isEmpty(token_address)) return
      sendJsonMessage({
        type: 'message',
        data: { token_address },
      })
    },
  })

  // Listen new message & push to array.
  useEffect(() => {
    if (!lastJsonMessage || !lastJsonMessage.data) return
    if (isSuccessMessage(lastJsonMessage)) {
      setTradeRecords(lastJsonMessage.data)
    }
  }, [lastJsonMessage])

  return {
    tradeRecords,
  }
}
