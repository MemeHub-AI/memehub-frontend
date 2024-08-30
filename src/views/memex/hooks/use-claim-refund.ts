import { type Address } from 'viem'
import { useAccount, useWriteContract } from 'wagmi'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { CONTRACT_ERR } from '@/errors/contract'
import { useTypedFn } from '@/hooks/use-typed-fn'
import { useCheckAccount } from '@/hooks/use-check-chain'
import { memexIdoAbiMap, MemexIdoVersion } from '@/contract/abi/memex/ido'

export const useIdeaClaimRefund = (
  chainId: number,
  version: MemexIdoVersion | undefined,
  contract: string | undefined | null,
  onFinally?: () => void
) => {
  const { t } = useTranslation()
  const { address } = useAccount()
  const [toasts, setToastType] = useTypedFn({
    claim: {
      loading: () => toast.loading(t('claiming')),
      success: () => toast.success(t('claim-success')),
    },
    refund: {
      loading: () => toast.loading(t('refunding')),
      success: () => toast.success(t('refund-success')),
    },
  })
  const { checkAccount } = useCheckAccount()
  const config = {
    abi: memexIdoAbiMap[version!],
    address: contract as Address,
    chainId,
  }

  const {
    data: hash,
    isPending,
    writeContract,
    reset,
  } = useWriteContract({
    mutation: {
      onMutate: toasts.loading,
      onSettled: (_, __, ___, id) => toast.dismiss(id),
      onError: ({ message }) => {
        CONTRACT_ERR.message(message)
        reset()
      },
    },
  })
  const { isLoading: isWaiting } = useWaitForTx({
    hash,
    onLoading: toasts.loading,
    onError: ({ message }) => CONTRACT_ERR.message(message),
    onSuccess: toasts.success,
    onFinally: () => {
      reset()
      onFinally?.()
      toast.dismiss()
    },
  })

  const checkForWrite = async () => {
    if (!contract || !address || !config.abi) return false
    if (!(await checkAccount(chainId))) return false
    return true
  }

  const claim = async () => {
    if (!(await checkForWrite())) return

    setToastType('claim')
    writeContract({
      ...config,
      functionName: 'claimToken',
    })
  }

  const refund = async () => {
    if (!(await checkForWrite())) return

    setToastType('refund')
    writeContract({
      ...config,
      functionName: 'withdrawETH',
    })
  }

  const refundInitial = async () => {
    if (!(await checkForWrite())) return

    setToastType('refund')
    writeContract({
      ...config,
      functionName: 'withdrawInitETH',
    })
  }

  return {
    isPending: isPending || isWaiting,
    claim,
    refund,
    refundInitial,
  }
}
