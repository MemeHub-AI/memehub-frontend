import { useEffect, useState } from 'react'
import { orderBy, uniqBy } from 'lodash'
import { useRouter } from 'next/router'

import { apiUrl } from '@/config/url'
import { useWebsocket } from '@/hooks/use-websocket'
import { useTokenQuery } from '../use-token-query'
import type {
  TokenWsOnEvents,
  TokenWsEmitEvents,
  TokenWsHolder,
  TokenWsTradePrice,
  TokenWsTrade,
  TokenWsRewardInfo,
} from './types'
import { Routes } from '@/routes'

const uniqKey: keyof TokenWsTrade = 'hash'

const sortKey: keyof TokenWsTrade = 'timestamp'

const pageSize = 10

export const useTokenWs = (disabled = false) => {
  const { chainName, tokenAddr } = useTokenQuery()
  const router = useRouter()
  const ws = useWebsocket<TokenWsOnEvents, TokenWsEmitEvents>(
    `${apiUrl.ws}/ws/v2/coin/trades`,
    {
      disabled,
      shouldReconnect: () => router.pathname === Routes.TokenPage,
    }
  )
  const [tradeRecords, setTradeRecords] = useState<TokenWsTrade[]>([])
  const [holders, setHolders] = useState<TokenWsHolder[]>([])
  const [tradePrice, setTradePrice] = useState<TokenWsTradePrice>()
  const [hasMoreTrades, setHasMoreTrades] = useState(false)
  const [rewardInfo, setRewardInfo] = useState<TokenWsRewardInfo>()

  const onTrades = ({ data, extra }: TokenWsOnEvents['trades']) => {
    setHasMoreTrades(!!extra?.hasmore)
    setTradeRecords((prev) =>
      orderBy(uniqBy([...prev, ...data], uniqKey), [sortKey], 'desc')
    )
  }

  const onPrice = ({ data }: TokenWsOnEvents['price']) => setTradePrice(data)

  const onHolders = ({ data }: TokenWsOnEvents['holders']) => {
    setHolders(data)
  }

  const onUpdate = ({ data }: TokenWsOnEvents['update']) => {
    if (data.type === 'trades') return onTrades(data)
    if (data.type === 'holders') return onHolders(data)
    if (data.type === 'price') return onPrice(data)
  }

  const fetchNextTrades = () => {
    if (!hasMoreTrades || !ws.isOpen) return

    ws.emit('history', {
      chain: chainName,
      token: tokenAddr,
      offset: tradeRecords.length,
      limit: pageSize * 2,
    })
  }

  useEffect(() => {
    if (!ws.isOpen) return

    ws.on('trades', onTrades)
    ws.on('holders', onHolders)
    ws.on('price', onPrice)
    ws.on('update', onUpdate)
    ws.on('reward-info', ({ data }) => setRewardInfo(data))

    ws.emit('listen', {
      chain: chainName,
      token: tokenAddr,
      offset: 0,
      limit: pageSize,
    })

    return ws.offAll
  }, [ws.isOpen, chainName, tokenAddr])

  return {
    ...ws,
    tradeRecords,
    holders,
    tradePrice,
    hasMoreTrades,
    rewardInfo,
    fetchNextTrades,
  }
}
