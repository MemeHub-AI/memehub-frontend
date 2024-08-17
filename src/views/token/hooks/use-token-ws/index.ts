import { useEffect, useState } from 'react'
import { uniqBy } from 'lodash'

import { apiUrl } from '@/config/url'
import { useWebsocket } from '@/hooks/use-websocket'
import { useTokenQuery } from '../use-token-query'
import type {
  TokenOnEvents,
  TokenEmitEvents,
  TokenHolder,
  TokenPrice,
  TokenTrade,
} from './types'

const uniqKey: keyof TokenTrade = 'hash'

const pageSize = 10

export const useTokenWs = (disabled = false) => {
  const { chainName, tokenAddr } = useTokenQuery()
  const ws = useWebsocket<
    TokenOnEvents,
    TokenEmitEvents,
    { has_more: boolean }
  >(disabled ? '' : `${apiUrl.ws}/ws/v2/coin/trades`)
  const [tradeRecords, setTradeRecords] = useState<TokenTrade[]>([])
  const [holders, setHolders] = useState<TokenHolder[]>([])
  const [tradePrice, setTradePrice] = useState<TokenPrice>()
  const [hasMoreTrades, setHasMoreTrades] = useState(true)

  const unshiftTrades = (trades: TokenTrade[]) => {
    setTradeRecords((prev) => uniqBy([...trades, ...prev], uniqKey))
  }

  const pushTrades = (trades: TokenTrade[]) => {
    setTradeRecords((prev) => uniqBy([...prev, ...trades], uniqKey))
  }

  const onUpdate = ({ type, data, extra }: TokenOnEvents['update']) => {
    if (extra?.has_more) setHasMoreTrades(extra.has_more)
    if (type === 'trades') return pushTrades(data as TokenTrade[])
    if (type === 'holders') return setHolders(data as TokenHolder[])
    if (type === 'price') return setTradePrice(data as TokenPrice)
  }

  const fetchNextTrades = () => {
    if (!hasMoreTrades || !ws.isOpen) return

    ws.emit('history', {
      offset: tradeRecords.length,
      limit: pageSize * 2,
    })
  }

  useEffect(() => {
    ws.on('trades', unshiftTrades)
    ws.on('holders', setHolders)
    ws.on('price', setTradePrice)
    ws.on('update', onUpdate)

    if (!ws.isOpen) return
    ws.emit('listen', {
      chain: chainName,
      token: tokenAddr,
      offset: 1,
      limit: pageSize,
    })
  }, [ws.isOpen])

  return {
    ...ws,
    tradeRecords,
    holders,
    tradePrice,
    hasMoreTrades,
    fetchNextTrades,
  }
}
