import { useEffect, useState } from 'react'
import { orderBy, uniqBy } from 'lodash'

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

const sortKey: keyof TokenTrade = 'timestamp'

const pageSize = 10

export const useTokenWs = (disabled = false) => {
  const { chainName, tokenAddr } = useTokenQuery()
  const ws = useWebsocket<TokenOnEvents, TokenEmitEvents>(
    disabled ? '' : `${apiUrl.ws}/ws/v2/coin/trades`
  )
  const [tradeRecords, setTradeRecords] = useState<TokenTrade[]>([])
  const [holders, setHolders] = useState<TokenHolder[]>([])
  const [tradePrice, setTradePrice] = useState<TokenPrice>()
  const [hasMoreTrades, setHasMoreTrades] = useState(false)

  const onTrades = ({ data, extra }: TokenOnEvents['trades']) => {
    setHasMoreTrades(!!extra?.hasmore)
    setTradeRecords((prev) =>
      orderBy(uniqBy([...prev, ...data], uniqKey), [sortKey], 'desc')
    )
  }

  const onHolders = ({ data }: TokenOnEvents['holders']) => {
    setHolders(data)
  }

  const onPrice = ({ data }: TokenOnEvents['price']) => {
    setTradePrice(data)
  }

  const onUpdate = ({ data }: TokenOnEvents['update']) => {
    // TODO: fix type
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
    ws.on('trades', onTrades)
    ws.on('holders', onHolders)
    ws.on('price', onPrice)
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
