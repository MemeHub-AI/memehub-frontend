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

const pageSize = 10

export const useTradeRecord = () => {
  const [tradeRecords, setTradeRecords] = useState<WSTradeRecordMessage[]>([])
  const [page, setPage] = useState(2)
  const [hasMore, setHasMore] = useState(true)
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

  const fetchNextPage = () => {
    setPage((page) => ++page)

    sendJsonMessage({
      type: 'message',
      data: {
        chain: chainName,
        token_address: tokenAddr,
        offset: (page - 1) * pageSize,
        limit: pageSize,
      },
    })
  }

  const unique = (records: WSTradeRecordMessage[]) => {
    return records.reduce((acc, cur) => {
      const isExisted = acc.find((r) => r.hash === cur.hash)
      if (!isExisted) acc.push(cur)
      return acc
    }, [] as WSTradeRecordMessage[])
  }

  useEffect(() => {
    if (lastJsonMessage?.type === WSMessageType.ConnectInvalid) {
      return getWebSocket()?.close()
    }
    if (!lastJsonMessage || !lastJsonMessage.data) return

    setHasMore(lastJsonMessage.extra.hasmore)
    setTradeRecords((old) => {
      const records = [...old, ...(lastJsonMessage.data ?? [])]
      return unique(records)
    })
  }, [lastJsonMessage])

  return {
    hasMore: hasMore && !isEmpty(tradeRecords),
    tradeRecords,
    fetchNextPage,
  }
}
