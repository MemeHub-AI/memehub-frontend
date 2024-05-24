import { useEffect } from 'react'
import { useWaitForTransactionReceipt } from 'wagmi'

import type { Address, WaitForTransactionReceiptErrorType } from 'viem'

interface Options {
  hash: Address | undefined
  onSuccess?: (
    data: ReturnType<typeof useWaitForTransactionReceipt>['data']
  ) => void
  onError?: (error: WaitForTransactionReceiptErrorType | null) => void
  onFillay?: () => void
}

export const useWaitForTx = (options: Options) => {
  const { hash, onSuccess, onError, onFillay } = options

  const result = useWaitForTransactionReceipt({ hash })

  useEffect(() => {
    const { data, error, isError, isSuccess } = result

    if (isError) onError?.(error)
    if (isSuccess) onSuccess?.(data)
    if (isError || isSuccess) onFillay?.()
  }, [result])

  return result
}
