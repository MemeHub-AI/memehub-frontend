import { useEffect, useRef } from 'react'
import { useWaitForTransactionReceipt } from 'wagmi'
import type { Address, WaitForTransactionReceiptErrorType } from 'viem'

interface Options {
  hash: Address | undefined
  onLoading?: () => void
  onFetching?: () => void
  onSuccess?: (
    data: ReturnType<typeof useWaitForTransactionReceipt>['data']
  ) => void
  onError?: (error: WaitForTransactionReceiptErrorType) => void
  onFillay?: () => void
}

export const useWaitForTx = (options: Options) => {
  const { hash, onLoading, onFetching, onSuccess, onError, onFillay } = options
  const result = useWaitForTransactionReceipt({ hash })
  const prevHash = useRef<string>()

  useEffect(() => {
    const { data, error, isLoading, isFetching, isError, isSuccess } = result
    const isSameHash = prevHash.current === hash
    const isPending = isLoading || isFetching

    if (isSameHash && isPending) return
    if (isLoading) onLoading?.()
    if (isFetching) onFetching?.()
    if (isError) onError?.(error)
    if (isSuccess) onSuccess?.(data)
    if (isError || isSuccess) onFillay?.()

    if (hash) prevHash.current = hash
  }, [result])

  return result
}
