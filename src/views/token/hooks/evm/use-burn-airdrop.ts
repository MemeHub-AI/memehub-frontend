import { useEffect } from 'react'
import { useReadContract, useWriteContract } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { useTokenContext } from '@/contexts/token'
import {
  distributorAbiMap,
  DistributorVersion,
} from '@/contract/abi/distributor'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { CONTRACT_ERR } from '@/errors/contract'
import { useCheckAccount } from '@/hooks/use-check-chain'
import { useAirdropStore } from '@/stores/use-airdrop'

export const useBurnAirdrop = (
  id: number | undefined,
  onFinally?: () => void
) => {
  const { t } = useTranslation()
  const { chainId, airdropVersion, airdropAddr } = useTokenContext()
  const { checkForConnect, checkForChain } = useCheckAccount()
  const { setIsCalimingAirdrop } = useAirdropStore()

  const airdropConfig = {
    abi: distributorAbiMap[airdropVersion as DistributorVersion],
    address: airdropAddr!,
    chainId,
  }

  const { data: isBurned, refetch: refetchBurned } = useReadContract({
    ...airdropConfig,
    functionName: 'isBurn',
    args: [BigInt(id || -1)],
    query: { enabled: typeof id === 'number' },
  })

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
    onSuccess: () => toast.success(t('airdrop.burn.success')),
    onFinally: () => {
      refetchBurned()
      onFinally?.()
      reset()
    },
  })
  const isBurning = isPending || isLoading

  const burn = async () => {
    if (!checkForConnect()) return
    if (!(await checkForChain(chainId))) return
    if (!airdropAddr || typeof id !== 'number') {
      CONTRACT_ERR.configNotFound()
      return
    }

    // TODO: should simulate first.
    writeContract({
      ...airdropConfig,
      functionName: 'burnToken',
      args: [BigInt(id)],
    })
  }

  useEffect(() => setIsCalimingAirdrop(isBurning), [isBurning])

  return {
    isBurned,
    isBurning,
    burn,
  }
}
