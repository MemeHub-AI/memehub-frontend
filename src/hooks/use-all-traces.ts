import { useEffect, useState } from 'react'

import {
  TokenWsCreate,
  TokenWsEmitEvents,
  TokenWsOnEvents,
  TokenWsTrade,
} from '@/views/token/hooks/use-token-ws/types'
import { useWebsocket } from './use-websocket'
import { apiUrl } from '@/config/url'

export const useAllTrades = (disabled = false) => {
  const [allTrades, setAllTrades] = useState<TokenWsTrade[]>([])
  const [coinCreate, setCoinCreate] = useState<TokenWsCreate>()
  const ws = useWebsocket<TokenWsOnEvents, TokenWsEmitEvents>(
    disabled ? '' : `${apiUrl.ws}/ws/v2/global/feeds`,
    { shouldReconnect: () => true }
  )

  const onUpdate = ({ data }: TokenWsOnEvents['update']) => {
    if (data.type === 'all-trades') setAllTrades(data.data)
    if (data.type === 'all-coin-created') setCoinCreate(data.data)
  }

  useEffect(() => {
    if (!ws.isOpen) return

    ws.on('update', onUpdate)
  }, [ws.isOpen])

  return {
    ...ws,
    allTrades,
    coinCreate,
  }
}
