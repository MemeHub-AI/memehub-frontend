import { useEffect } from 'react'
import { useReadContract, useWriteContract } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Address } from 'viem'

import {
  distributorAbiMap,
  DistributorVersion,
} from '@/contract/abi/distributor'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { CONTRACT_ERR } from '@/errors/contract'
import { useCheckAccount } from '@/hooks/use-check-chain'
import { useAirdropStore } from '@/stores/use-airdrop'

export const useBurnAirdrop = (
  airdropId: number | undefined, // airdrop id
  airdropVersion: DistributorVersion | undefined,
  airdropAddr: string | undefined,
  chainId: number,
  onFinally?: () => void
) => {
  const { t } = useTranslation()
  const { checkForConnect, checkForChain } = useCheckAccount()
  const { setIsCalimingAirdrop } = useAirdropStore()
  const config = {
    abi: distributorAbiMap[airdropVersion!],
    address: airdropAddr as Address,
    chainId,
  }

  const { data: isBurned, refetch: refetchBurned } = useReadContract({
    ...config,
    functionName: 'isBurn',
    args: [BigInt(airdropId ?? -1)],
    query: { enabled: typeof airdropId === 'number' },
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
      reset()
      onFinally?.()
      refetchBurned()
      toast.dismiss()
    },
  })
  const isBurning = isPending || isLoading

  const burn = async () => {
    if (!checkForConnect()) return
    if (!(await checkForChain(chainId))) return
    if (!config.address || typeof airdropId !== 'number') {
      CONTRACT_ERR.configNotFound()
      return
    }

    // TODO/low: should simulate first.
    writeContract({
      ...config,
      functionName: 'burnToken',
      args: [BigInt(airdropId)],
    })
  }

  useEffect(() => setIsCalimingAirdrop(isBurning), [isBurning])

  return {
    isBurned,
    isBurning,
    burn,
  }
}
