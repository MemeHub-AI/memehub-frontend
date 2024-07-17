import { ReactNode, useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import { last, lowerCase } from 'lodash'
import { toast } from 'sonner'
import { Info, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

import {
  type CreateInfoLog,
  type TradeInfoLog,
  type WSMessageBase,
  type WSTradeLogMessage,
} from '@/api/websocket/types'

import {
  heartbeat,
  isSuccessMessage,
  isDisconnectMessage,
  wsApiURL,
} from '@/api/websocket'
import { Routes } from '@/routes'
import { fmt } from '@/utils/fmt'
import { Avatar } from '@/components/ui/avatar'
import { TradeType } from '@/constants/trade'

const toastBase = (children: ReactNode) => {
  toast.dismiss()
  const id = toast(
    <div className="relative w-full h-full flex gap-3">
      <X
        className="absolute top-0 right-0 text-zinc-500 hover:text-black cursor-pointer"
        size={20}
        onClick={() => toast.dismiss(id)}
      />
      <Info className="mt-0.5" />
      {children}
    </div>,
    { position: 'bottom-left', duration: Infinity }
  )
}

export const useTradeLogs = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const [isLatest, setIsLatest] = useState(false)
  const [lastTrade, setLastTrade] = useState<TradeInfoLog>()
  const [lastCreate, setLastCreate] = useState<CreateInfoLog>()

  const { lastJsonMessage, sendJsonMessage } =
    useWebSocket<WSMessageBase<WSTradeLogMessage> | null>(wsApiURL.tradeLogs, {
      heartbeat,
      onOpen: () => sendJsonMessage({ type: 'message', data: null }),
      shouldReconnect: () => true,
    })

  const shwoLatestTrade = (lastTrade: TradeInfoLog) => {
    toastBase(
      <div>
        <h3 className="font-bold text-lg mb-2">{t('log.trade')}</h3>
        <div className="rounded-md flex items-center gap-1 text-base">
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => {
              toast.dismiss()
              const href = fmt.toHref(
                Routes.Account,
                lastTrade.wallet_address || ''
              )
              router.push(href)
            }}
          >
            <Avatar src={lastTrade.logo || ''} size={24} />
            <span className="font-bold hover:underline">{lastTrade.name}</span>
          </div>
          <div className="mx-1">
            {lowerCase(
              lastTrade.type === TradeType.Buy ? t('bought') : t('sold')
            )}
          </div>
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => {
              toast.dismiss()
              const href = fmt.toHref(
                Routes.Main,
                lastTrade.chain_name || '',
                lastTrade.base_address || ''
              )
              router.push(href)
            }}
          >
            <Avatar src={lastTrade.coin_logo || ''} size={24} />
            <span className="font-bold hover:underline">
              {lastTrade.base_symbol}
            </span>
          </div>
        </div>
      </div>
    )
  }

  const showLatestCreate = (lastCreate: CreateInfoLog) => {
    toastBase(
      <div>
        <h3 className="font-bold text-lg mb-2">{t('log.create')}</h3>
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => {
            toast.dismiss()
            const href = fmt.toHref(
              Routes.Account,
              lastCreate.creator.wallet_address
            )
            router.push(href)
          }}
        >
          <Avatar src={lastCreate.creator.logo} size={24} />
          <span className="font-bold hover:underline">
            {lastCreate.creator.name}
          </span>
        </div>
        <div className="mx-1">{t('log.created')}</div>
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => {
            toast.dismiss()
            const href = fmt.toHref(
              Routes.Main,
              lastCreate.chain.name,
              lastCreate.address
            )
            router.push(href)
          }}
        >
          <Avatar src={lastCreate.image} size={24} />
          <span className="font-bold hover:underline">{lastCreate.ticker}</span>
        </div>
      </div>
    )
  }

  useEffect(() => {
    if (!lastJsonMessage) return
    // Not a success or update message, return it.
    if (
      !isSuccessMessage(lastJsonMessage) &&
      !isDisconnectMessage(lastJsonMessage)
    ) {
      return
    }
    const { trade_info, create_info } = lastJsonMessage.data
    const lastTrade = last(trade_info)
    const lastCreate = last(create_info)

    if (lastTrade) shwoLatestTrade(lastTrade)
    if (lastCreate) showLatestCreate(lastCreate)

    setIsLatest(true)
    setLastTrade(lastTrade)
    setLastCreate(lastCreate)
  }, [lastJsonMessage])

  useEffect(() => {
    if (isLatest) {
      setTimeout(() => setIsLatest(false), 5_000)
    }
  }, [isLatest])

  return {
    isLatest,
    lastTrade,
    lastCreate,
  }
}
