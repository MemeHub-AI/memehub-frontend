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
    // TODO: fix type
    if (data.type === 'all-trades') setAllTrades(data)
  }

  useEffect(() => {
    ws.on('update', onUpdate)
  }, [ws.isOpen])

  return { allTrades }
}
