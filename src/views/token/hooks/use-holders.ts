import { useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import { useRouter } from 'next/router'
import { isEmpty } from 'lodash'

import { heartbeat, isSuccessMessage, wsApiURL } from '@/api/websocket'
import { WSMessageBase, WSTradeInfoMessage } from '@/api/websocket/types'

export const useHolders = () => {
  const { query } = useRouter()
  const [holderInfo, setHolderInfo] = useState<WSTradeInfoMessage>()
  const token_address = query.address || ''

  const { lastJsonMessage, sendJsonMessage } = useWebSocket<
    WSMessageBase<WSTradeInfoMessage>
  >(wsApiURL.tokenInfo, {
    heartbeat,
    onOpen: () => {
      if (!token_address || isEmpty(token_address)) return
      sendJsonMessage({
        type: 'message',
        data: { token_address },
      })
    },
  })

  // useEffect(() => {
  //   if (isSuccessMessage(lastJsonMessage)) {
  //     setHolderInfo(lastJsonMessage.data)
  //   }
  // }, [lastJsonMessage])

  return {
    holderInfo,
  }
}
