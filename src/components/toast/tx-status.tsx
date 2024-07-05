import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { SlippageError } from './slippage-error'
import { TxLoading } from './tx-loading'
import { TxSuccess } from './tx-success'
import { useEffect } from 'react'
import { Router } from 'next/router'
import { toast } from 'sonner'

interface Props {
  isBuy: boolean
  txUrl: string
  tokenAmount: string
  nativeTokenAmount: string
  diamondQuantity: number
  hash?: `0x${string}`
  getToastId: () => string | number
}
export const TxStatus = (props: Props) => {
  const { hash, getToastId, ...successProps } = props

  const toastId = getToastId()
  const { isLoading, isError, isSuccess } = useWaitForTx({ hash })

  useEffect(() => {
    const close = () => toast.dismiss(toastId)

    Router.events.on('routeChangeStart', close)
    return () => {
      Router.events.off('routeChangeStart', close)
    }
  }, [])

  if (isLoading)
    return <TxLoading toastId={toastId} txUrl={successProps.txUrl} />

  if (isError)
    return <SlippageError toastId={toastId} txUrl={successProps.txUrl} />

  if (isSuccess) return <TxSuccess toastId={toastId} {...successProps} />
}
