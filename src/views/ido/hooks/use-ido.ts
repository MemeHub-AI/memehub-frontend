import { useWriteContract } from 'wagmi'
import { parseEther } from 'viem'
import { toast } from 'sonner'

import { idoAbi } from '@/contract/abi/ido/ido'
import { addrMap } from '@/contract/address'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { IDO_ERR } from '@/errors/ido'
import { useTranslation } from 'react-i18next'
import { useIdoContext } from '@/contexts/ido'
import { useCheckAccount } from '@/hooks/use-check-chain'

export const useIdo = (onFinally?: () => void) => {
  const { t } = useTranslation()
  const { chainId, poolId } = useIdoContext()
  const { checkForConnect, checkForChain } = useCheckAccount()
  const { ido } = addrMap[chainId] ?? {}

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
    onSuccess: () => toast.success(t('tx.success')),
    onFinally: () => {
      reset()
      onFinally?.()
      toast.dismiss()
    },
  })

  const checkForWrite = async () => {
    if (!checkForConnect()) return false
    if (!(await checkForChain(chainId))) return false

    return true
  }

  const buy = async (amount: string) => {
    if (!(await checkForWrite())) return

    // TODO: should simulate first.
    writeContract({
      abi: idoAbi,
      address: ido!,
      chainId,
      functionName: 'buy',
      args: [BigInt(poolId), [], BigInt(0)],
      value: parseEther(amount),
    })
  }

  const claim = async () => {
    if (!(await checkForWrite())) return

    // TODO: should simulate first.
    writeContract({
      abi: idoAbi,
      address: ido!,
      chainId,
      functionName: 'claimToken',
      args: [BigInt(poolId)],
    })
  }

  const refund = async () => {
    if (!(await checkForWrite())) return

    // TODO: should simulate first.
    writeContract({
      abi: idoAbi,
      address: ido!,
      chainId,
      functionName: 'claimEth',
      args: [BigInt(poolId)],
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
