import { useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'

import { wsApiUrl } from '@/api/websocket'
import { useTokenQuery } from './use-token-query'
import { TradeType } from '@/enums/trade'
import { ObjectLike } from '@/utils/types'

enum ReceiveEvents {
  Trades = 'trades',
  Holders = 'holders',
  Price = 'price',
  Update = 'update',
}

enum SendEvents {
  Listen = 'listen',
  Unlisten = 'unlisten',
  History = 'history',
}

interface WsReceiveBase<T = unknown> {
  type: string
  data: T
}

interface TradeItem {
  timestamp: number
  chain: string
  hash: string
  network: string
  executor: string
  base_address: string
  base_symbol: string
  base_amount: string
  quote_address: string
  quote_symbol: string
  quote_amount: string
  type: TradeType
  price: string
  usd_price: string
  marketcap: string
}

interface HolderItem {
  chain: string
  token: string
  holder: string
  amount: string
  flag: string
}

interface Price {
  symbol: string
  price: string
}

export const useTokenWs = (disabled = false) => {
  const { chainName, tokenAddr } = useTokenQuery()
  const [tradeRecords, setTradeRecords] = useState<TradeItem[]>([])
  const [holders, setHolders] = useState<HolderItem[]>([])
  const [tradePrice, setTradePrice] = useState<Price>()

  const { lastJsonMessage, sendJsonMessage } = useWebSocket<
    WsReceiveBase<ObjectLike<any>>
  >(
    wsApiUrl.trades,
    {
      onOpen: () => {
        sendJsonMessage({
          type: SendEvents.Listen,
          data: {
            chain: chainName,
            token: tokenAddr,
          },
        })
      },
    },
    !disabled
  )

  const handleTrades = (trades: TradeItem[]) => {
    if (!trades) return
    trades = Array.isArray(trades) ? trades : [trades]
    setTradeRecords((old) => [...trades, ...old])
  }

  const handleHolders = (holders: HolderItem[]) => {
    if (!holders) return
    if (Array.isArray(holders)) setHolders(holders)
  }

  const handlePrice = (price: Price) => {
    if (price) setTradePrice(price)
  }

  const categoryEvents = (type: string, data: ObjectLike<any>) => {
    switch (type) {
      case ReceiveEvents.Trades:
        return handleTrades(data.trades || (data as TradeItem[]))
      case ReceiveEvents.Holders:
        return handleHolders(data as HolderItem[])
      case ReceiveEvents.Price:
        return handlePrice(data as Price)
      case ReceiveEvents.Update:
        return categoryEvents(data.type, data.data)
    }
  }

  useEffect(() => {
    if (!lastJsonMessage) return
    const { type, data } = lastJsonMessage

    categoryEvents(type, data)
  }, [lastJsonMessage])

  return {
    tradeRecords,
    holders,
    tradePrice,
  }
}
