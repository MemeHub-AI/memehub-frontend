import {
  TokenEmitEvents,
  TokenOnEvents,
  TokenTrade,
} from '@/views/token/hooks/use-token-ws/types'
import { useWebsocket } from './use-websocket'
import { apiUrl } from '@/config/url'
import router from 'next/router'
import { Routes } from '@/routes'
import { useEffect, useState } from 'react'

export const useAllTrades = (disabled = false) => {
  const [allTrades, setAllTrades] = useState<TokenTrade[]>([])
  const ws = useWebsocket<TokenOnEvents, TokenEmitEvents>(
    disabled ? '' : `${apiUrl.ws}/ws/v2/coin/trades`,
    { shouldReconnect: () => router.pathname === Routes.Memex }
  )

  const onAllTrades = () => ws.on('trades', onAllTrades)

  const onUpdate = ({ data }: TokenOnEvents['update']) => {
    console.log('trades data: ', data)

    // TODO: fix type
    if (data.type === 'trades') setAllTrades(data.data)
  }

  useEffect(() => {
    if (!ws.isOpen) return

    ws.on('update', onUpdate)

    ws.emit('listen', {
      chain: 'bsc',
      token: '0x93240936e5ca2594cb0e12558a663e5c0a047857',
      offset: 1,
      limit: 1,
    })
  }, [ws.isOpen])

  return { ...ws, allTrades }
}
