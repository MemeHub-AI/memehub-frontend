import { useEffect } from 'react'
import { useWaitForTransactionReceipt } from 'wagmi'
import type { Address, WaitForTransactionReceiptErrorType } from 'viem'
import { Router } from 'next/router'

interface Options {
  hash: Address | undefined
  onLoading?: () => void
  onFetching?: () => void
  onSuccess?: (
    data: ReturnType<typeof useWaitForTransactionReceipt>['data']
  ) => void
  onError?: (error: WaitForTransactionReceiptErrorType) => void
  onFinally?: () => void
}

export const useWaitForTx = (options: Options) => {
  const { hash, onLoading, onFetching, onSuccess, onError, onFinally } = options
  const result = useWaitForTransactionReceipt({
    hash,
    query: { enabled: !!hash },
  })
  const { data, error, isLoading, isFetching, isError, isSuccess } = result

  // Attention: track only the states you need!!!
  useEffect(() => {
    if (isLoading) onLoading?.()
    if (isFetching) onFetching?.()
    if (isError) onError?.(error)
    if (isSuccess) onSuccess?.(data)
    if (isError || isSuccess) onFinally?.()
  }, [isLoading, isFetching, isError, isSuccess])

  const onRotueChange = () => {
    if (result.status === 'pending') onFinally?.()
  }

  useEffect(() => {
    Router.events.on('routeChangeStart', onRotueChange)

    return () => Router.events.off('routeChangeStart', onRotueChange)
  }, [])

  return result
}
