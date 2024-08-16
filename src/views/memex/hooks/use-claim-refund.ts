import { useMemo, useState } from 'react'
import { type Address } from 'viem'
import { useAccount, useReadContracts, useWriteContract } from 'wagmi'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import { memexIdoAbi } from '@/contract/abi/memex/ido'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { CONTRACT_ERR } from '@/errors/contract'

export const useIdeaClaimRefund = (
  addr: string | undefined | null,
  chainId: number,
  onFinally?: () => void
) => {
  const { t } = useTranslation()
  const { address } = useAccount()
  const toasts = useMemo(
    () => ({
      claim: {
        loading: () => toast.loading(t('claiming')),
        success: () => toast.success(t('claim-success')),
      },
      refund: {
        loading: () => toast.loading(t('refunding')),
        success: () => toast.success(t('refund-success')),
      },
    }),
    []
  )
  const [type, setType] = useState<keyof typeof toasts>('claim')

  const idoConfig = {
    abi: memexIdoAbi,
    address: addr as Address,
    chainId,
  }
  const args = [address!] as const

  const {
    data: [
      canClaim = false,
      canRefund = false,
      isClaimed = false,
      isRefunded = false,
    ] = [],
    isLoading,
    refetch,
  } = useReadContracts({
    contracts: [
      { ...idoConfig, functionName: 'isCanClaimToken', args },
      { ...idoConfig, functionName: 'isCanWithdraw', args },
      { ...idoConfig, functionName: 'isClaimToken', args },
      { ...idoConfig, functionName: 'isWithdrawETH', args },
    ],
    query: {
      enabled: !!address && !!addr,
      select: (data) => data.map((d) => d.result),
    },
  })

  const {
    data: hash,
    isPending,
    writeContract,
    reset,
  } = useWriteContract({
    mutation: {
      onMutate: toasts[type].loading,
      onSettled: (_, __, ___, id) => toast.dismiss(id),
      onError: ({ message }) => {
        CONTRACT_ERR.message(message)
        reset()
      },
    },
  })
  const { isLoading: isWaiting } = useWaitForTx({
    hash,
    onLoading: toasts[type].loading,
    onError: ({ message }) => CONTRACT_ERR.message(message),
    onSuccess: toasts[type].success,
    onFillay: () => {
      reset()
      refetch()
      onFinally?.()
      toast.dismiss()
    },
  })

  const checkForWrite = () => {
    if (!addr || !address) return false
    return true
  }

  const claim = () => {
    if (!canClaim) return
    if (!checkForWrite()) return

    setType('claim')
    writeContract({
      ...idoConfig,
      functionName: 'claimToken',
    })
  }

  const refund = () => {
    if (!canRefund) return
    if (!checkForWrite()) return

    setType('refund')
    writeContract({
      ...idoConfig,
      functionName: 'withdrawETH',
    })
  }

  return {
    canClaim,
    canRefund,
    isClaimed,
    isRefunded,
    isLoading,
    isPending: isPending || isWaiting,
    refetch,
    claim,
    refund,
  }
}
