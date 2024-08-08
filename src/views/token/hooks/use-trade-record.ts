import { useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import { first, isEmpty } from 'lodash'

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
    // !isNotFound
    false // TODO: remove
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

  const uniqueRecords = (records: WSTradeRecordMessage[]) => {
    return records.reduce((acc, cur) => {
      const isExisted = acc.find((r) => r.hash === cur.hash)
      if (!isExisted) acc.push(cur)
      return acc
    }, [] as WSTradeRecordMessage[])
  }

  const pushRecords = (records: WSTradeRecordMessage[]) => {
    setTradeRecords((old) => {
      return uniqueRecords([...old, ...records])
    })
  }

  const unshiftRecords = (records: WSTradeRecordMessage[]) => {
    setTradeRecords((old) => {
      return uniqueRecords([...records, ...old])
    })
  }

  useEffect(() => {
    if (lastJsonMessage?.type === WSMessageType.ConnectInvalid) {
      return getWebSocket()?.close()
    }
    if (!lastJsonMessage || !lastJsonMessage.data) return
    const { data } = lastJsonMessage

    setHasMore(lastJsonMessage.extra.hasmore)
    if (isEmpty(data)) return pushRecords(data)

    const newTime = first(data)?.create_time ?? 0
    const oldTime = first(tradeRecords)?.create_time ?? 0

    // Is latest data.
    if (newTime > oldTime) return unshiftRecords(data)
    pushRecords(data)
  }, [lastJsonMessage])

  return {
    hasMore: hasMore && !isEmpty(tradeRecords),
    tradeRecords,
    fetchNextPage,
  }
}
