import { useAccount, useBalance, useWriteContract } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { parseEther, type Address } from 'viem'
import { BigNumber } from 'bignumber.js'
import { formatEther } from 'viem'

import { CONTRACT_ERR } from '@/errors/contract'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { useCheckAccount } from '@/hooks/use-check-chain'
import { memexIdoAbiMap, MemexIdoVersion } from '@/contract/abi/memex/ido'
import { BI_ZERO } from '@/constants/number'
import { useInvite } from '@/hooks/use-invite'

export const useIdeaLike = (
  addr: string | null | undefined,
  chainId: number,
  version: MemexIdoVersion | undefined,
  onFillay?: () => void
) => {
  const { t } = useTranslation()
  const { address } = useAccount()
  const { data: { value = BI_ZERO } = {} } = useBalance({
    address,
    chainId,
  })
  const balance = formatEther(value)
  const { checkForChain, checkForConnect } = useCheckAccount()
  const { getReferrals } = useInvite()

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
    if (!checkForConnect()) return
    if (!(await checkForChain(chainId))) return
    if (BigNumber(balance.toString()).lt(value)) {
      CONTRACT_ERR.balanceInsufficient()
      return
    }
    if (!addr || !memexIdoAbiMap[version!]) {
      CONTRACT_ERR.configNotFound()
      return
    }
    if (BigNumber(value.toString()).isZero()) {
      CONTRACT_ERR.amountInvlid()
      return
    }

    writeContract({
      abi: memexIdoAbiMap[version!],
      address: addr as Address,
      chainId,
      functionName: 'like',
      args: [await getReferrals()],
      value: parseEther(value),
    })
  }

  return {
    isLiking: isPending || isLoading,
    like,
  }
}
