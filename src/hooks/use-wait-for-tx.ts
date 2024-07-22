import { useEffect } from 'react'
import { useWaitForTransactionReceipt } from 'wagmi'

import type { Address, WaitForTransactionReceiptErrorType } from 'viem'

interface Options {
  hash: Address | undefined
  onLoading?: () => void
  onFetching?: () => void
  onSuccess?: (
    data: ReturnType<typeof useWaitForTransactionReceipt>['data'],
  ) => void
  onError?: (error: WaitForTransactionReceiptErrorType) => void
  onFillay?: () => void
}

let cacheHash: string | undefined

export const useWaitForTx = (options: Options) => {
  const { hash, onLoading, onFetching, onSuccess, onError, onFillay } = options
  const result = useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    const { data, error, isLoading, isFetching, isError, isSuccess } = result

    // Prevent repeat call `onLoading`/`onFetching`.
    const isSameHash = !!(hash && hash === cacheHash)
    const isPending = isLoading || isFetching
    if (isSameHash && isPending) return

    if (isLoading) onLoading?.()
    if (isFetching) onFetching?.()
    if (isError) onError?.(error)
    if (isSuccess) onSuccess?.(data)
    if (isError || isSuccess) onFillay?.()

    cacheHash = hash
  }, [result])

  return result
}
