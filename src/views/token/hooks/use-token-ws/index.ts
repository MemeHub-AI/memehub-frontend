import { useEffect, useState } from 'react'
import { first, orderBy, uniqBy } from 'lodash'
import { useRouter } from 'next/router'
import { BigNumber } from 'bignumber.js'

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
import { Routes } from '@/routes'
import { useLruMap } from '@/hooks/use-lru-map'
import { TokenListItem } from '@/api/token/types'

const uniqKey: keyof TokenTrade = 'hash'

const sortKey: keyof TokenTrade = 'timestamp'

const pageSize = 10

// TODO/top: calc market cap via `useUniswapV2Amount`
export const useTokenWs = (
  tokenInfo: TokenListItem | undefined,
  disabled = false
) => {
  const { chainName, tokenAddr } = useTokenQuery()
  const router = useRouter()
  const ws = useWebsocket<TokenOnEvents, TokenEmitEvents>(
    `${apiUrl.ws}/ws/v2/coin/trades`,
    {
      disabled,
      shouldReconnect: () => router.pathname === Routes.TokenPage,
    }
  )
  const { set, get: getReward } = useLruMap<Record<string, string>>()
  const [tradeRecords, setTradeRecords] = useState<TokenTrade[]>([])
  const [holders, setHolders] = useState<TokenHolder[]>([])
  const [tradePrice, setTradePrice] = useState<TokenPrice>()
  const [hasMoreTrades, setHasMoreTrades] = useState(false)
  const [marketCap, setMarketCap] = useState('')

  const onTrades = ({ data, extra }: TokenOnEvents['trades']) => {
    if (extra?.rewarded) {
      data.map(({ hash }) => set(hash, extra.rewarded))
    }

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

  // Calculate for market cap
  useEffect(() => {
    const { start_price = 0, total_supply = 0 } = tokenInfo ?? {}
    const { price = 0 } = tradePrice ?? {}
    const { marketcap } = first(tradeRecords) ?? {}

    const tokenPrice = BigNumber(start_price).multipliedBy(total_supply)
    const marketCap = BigNumber(price).multipliedBy(marketcap || tokenPrice)

    setMarketCap(marketCap.toFixed())
  }, [tokenInfo, tradePrice, tradeRecords])

  useEffect(() => {
    if (!ws.isOpen) return

    ws.on('trades', onTrades)
    ws.on('holders', onHolders)
    ws.on('price', onPrice)
    ws.on('update', onUpdate)

    ws.emit('listen', {
      chain: chainName,
      token: tokenAddr,
      offset: 0,
      limit: pageSize,
    })
  }, [ws.isOpen])

  return {
    ...ws,
    tradeRecords,
    holders,
    tradePrice,
    hasMoreTrades,
    marketCap,
    getReward,
    fetchNextTrades,
  }
}
