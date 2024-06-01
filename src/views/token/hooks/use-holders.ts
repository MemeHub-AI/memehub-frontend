import useWebSocket from 'react-use-websocket'
import { useRouter } from 'next/router'
import { isEmpty } from 'lodash'

import {
  heartbeat,
  isSuccessMessage,
  isUpdateMessage,
  wsApiURL,
} from '@/api/websocket'
import { WSMessageBase, WSTradeInfoMessage } from '@/api/websocket/types'

export const useHolders = () => {
  const { query } = useRouter()

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
    })

  return {
    holders: lastJsonMessage?.data?.holders.slice(0, 10),
  }
}
