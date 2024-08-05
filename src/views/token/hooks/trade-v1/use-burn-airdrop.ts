import { useReadContract, useWriteContract } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { useTokenContext } from '@/contexts/token'
import {
  distributorAbiMap,
  DistributorAbiVersion,
} from '@/contract/abi/distributor'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { CONTRACT_ERR } from '@/errors/contract'
import { useCheckAccount } from '@/hooks/use-check-chain'

export const useBurnAirdrop = (id: number, onFinally?: () => void) => {
  const { t } = useTranslation()
  const { chainId, airdropVersion, airdropAddr } = useTokenContext()
  const { checkForConnect, checkForChain } = useCheckAccount()

  const airdropConfig = {
    abi: distributorAbiMap[airdropVersion as DistributorAbiVersion],
    address: airdropAddr!,
    chainId,
  }

  const { data: isBurned, refetch: refetchBurned } = useReadContract({
    ...airdropConfig,
    functionName: 'isBurn',
    args: [BigInt(id)],
  })

  const {
    data: hash,
    isPending: isBurning,
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
    onLoading: () => toast.loading(t('tx.confirmation')),
    onSuccess: () => toast.success(t('airdrop.burn.success')),
    onFillay: () => {
      refetchBurned()
      onFinally?.()
      reset()
    },
  })

  const burn = async () => {
    if (!checkForConnect()) return
    if (!(await checkForChain(chainId))) return
    if (!airdropAddr) return

    // TODO: should simulate first.
    writeContract({
      ...airdropConfig,
      functionName: 'burnToken',
      args: [BigInt(id)],
    })
  }

  return {
    isBurned,
    isBurning: isBurning || isLoading,
    burn,
  }
}
