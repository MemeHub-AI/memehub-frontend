import { useEffect } from 'react'
import { Router } from 'next/router'
import { toast } from 'sonner'
import { type Hash } from 'viem'

import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { SlippageError } from './slippage-error'
import { TxLoading } from './tx-loading'
import { TxSuccess } from './tx-success'

export interface TxStatusProps {
  hash: Hash
  tokenLabel: string
  reserveLabel: string
  reward: string
  txUrl: string
  isBuy: boolean
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
    <>
      {isLoading && <TxLoading {...props} />}
      {isError && <SlippageError {...props} />}
      {isSuccess && <TxSuccess {...props} />}
    </>
  )
}
