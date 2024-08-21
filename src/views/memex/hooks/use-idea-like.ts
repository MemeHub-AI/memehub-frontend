import { useWriteContract } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { parseEther, type Address } from 'viem'
import { BigNumber } from 'bignumber.js'

import { CONTRACT_ERR } from '@/errors/contract'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { memexIdoAbi } from '@/contract/abi/memex/ido'
import { useCheckAccount } from '@/hooks/use-check-chain'

export const useIdeaLike = (
  addr: string | null | undefined,
  chainId: number,
  onFillay?: () => void
) => {
  const { t } = useTranslation()
  const { checkForChain } = useCheckAccount()

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
        CONTRACT_ERR.message(message)
        reset()
      },
    },
  })
  const { isLoading } = useWaitForTx({
    hash,
    onLoading: () => toast.loading(t('tx.confirming')),
    onError: ({ message }) => CONTRACT_ERR.message(message),
    onSuccess: () => toast.success(t('tx.success')),
    onFinally: () => {
      toast.dismiss()
      onFillay?.()
      reset()
    },
  })

  const like = async (value: string) => {
    if (!(await checkForChain(chainId))) return
    if (!addr) {
      CONTRACT_ERR.configNotFound()
      return
    }
    if (BigNumber(value.toString()).isZero()) {
      CONTRACT_ERR.amountInvlid()
      return
    }

    writeContract({
      abi: memexIdoAbi,
      address: addr as Address,
      chainId,
      functionName: 'like',
      value: parseEther(value),
    })
  }

  return {
    isLiking: isPending || isLoading,
    like,
  }
}
