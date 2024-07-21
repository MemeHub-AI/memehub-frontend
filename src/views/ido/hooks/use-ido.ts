import { useAccount, useWriteContract } from 'wagmi'
import { parseEther } from 'viem'
import { toast } from 'sonner'

import { idoAbi } from '@/contract/v3/abi/ido'
import { v3Addr } from '@/contract/v3/address'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { IDO_ERR } from '@/errors/ido'
import { useTranslation } from 'react-i18next'
import { useIdoContext } from '@/contexts/ido'

const poolId = 0 // TODO: temp

export const useIdo = () => {
  const { t } = useTranslation()
  const { chainId } = useIdoContext()
  const { address } = useAccount()
  const { ido } = v3Addr[chainId] ?? {}

  const {
    data: hash,
    isPending,
    writeContract,
    reset,
  } = useWriteContract({
    mutation: {
      onMutate: () => toast.loading(t('tx.submitting')),
      onSettled: (_, __, ___, id) => toast.dismiss(id),
      onError: ({ message }) => {
        IDO_ERR.message(message)
        reset()
      },
    },
  })
  const { isLoading } = useWaitForTx({
    hash,
    onLoading: () => toast.loading(t('tx.waiting')),
    onError: ({ message }) => IDO_ERR.message(message),
    onSuccess: () => toast.success(t('ido.tx.success')),
    onFillay: () => {
      reset()
      toast.dismiss()
    },
  })

  const buy = (amount: string) => {
    writeContract({
      abi: idoAbi,
      address: ido!,
      chainId,
      functionName: 'buy',
      args: [BigInt(poolId), [], BigInt(0)],
      value: parseEther(amount),
    })
  }

  const claim = () => {
    writeContract({
      abi: idoAbi,
      address: ido!,
      chainId,
      functionName: 'claimToken',
      args: [BigInt(poolId), address!],
    })
  }

  const refund = () => {
    writeContract({
      abi: idoAbi,
      address: ido!,
      chainId,
      functionName: 'claimEth',
      args: [BigInt(poolId), address!],
    })
  }

  return {
    isLoading: isPending || isLoading,
    buy,
    claim,
    refund,
    reset,
  }
}
