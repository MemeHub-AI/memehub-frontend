import { type Address } from 'viem'
import { useAccount, useReadContracts, useWriteContract } from 'wagmi'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

import { memexIdoAbi } from '@/contract/abi/memex/ido'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { CONTRACT_ERR } from '@/errors/contract'

export const useClaimRefund = (
  addr: string | undefined | null,
  onFinally?: () => void
) => {
  const { t } = useTranslation()
  const { address, chainId = 0 } = useAccount()
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
      onError: ({ message }) => {
        CONTRACT_ERR.message(message)
        reset()
      },
    },
  })
  const { isLoading: isWaiting } = useWaitForTx({
    hash,
    onLoading: () => toast.loading(t('refunding')),
    onError: ({ message }) => CONTRACT_ERR.message(message),
    onSuccess: () => toast.success(t('refund-success')),
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

    writeContract({
      ...idoConfig,
      functionName: 'claimToken',
    })
  }

  const refund = () => {
    if (!canRefund) return
    if (!checkForWrite()) return

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
