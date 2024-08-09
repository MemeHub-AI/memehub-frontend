import { useEffect } from 'react'
import { Router } from 'next/router'
import { toast } from 'sonner'
import { type Hash } from 'viem'

import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { SlippageError } from './slippage-error'
import { TxLoading } from './tx-loading'
import { TxSuccess } from './tx-success'
import { TradeToastProvider } from '@/contexts/trade-toast'

export interface TxStatusProps {
  hash: Hash
  txUrl: string
  isBuy: boolean
  rewardAmount: number
  tokenLabel: string
  reserveLabel: string
  getToastId: () => string | number
}

export const TxStatus = (props: TxStatusProps) => {
  const { isLoading, isError, isSuccess } = useWaitForTx({ hash: props.hash })

  useEffect(() => {
    const close = () => toast.dismiss(props.getToastId())

    Router.events.on('routeChangeStart', close)
    return () => {
      Router.events.off('routeChangeStart', close)
    }
  }, [])

  return (
    <TradeToastProvider value={props}>
      {isLoading && <TxLoading />}
      {isError && <SlippageError />}
      {isSuccess && <TxSuccess />}
    </TradeToastProvider>
  )
}
