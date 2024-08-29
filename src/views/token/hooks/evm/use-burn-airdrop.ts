import { useEffect } from 'react'
import { useWriteContract } from 'wagmi'
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
  id: bigint,
  chainId: number,
  version: DistributorVersion | undefined,
  contract: string | undefined,
  onFinally?: () => void
) => {
  const { t } = useTranslation()
  const { checkAccount } = useCheckAccount()
  const { setIsCalimingAirdrop } = useAirdropStore()
  const config = {
    abi: distributorAbiMap[version!],
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
      toast.dismiss()
    },
  })
  const isBurning = isPending || isLoading

  const burn = async () => {
    if (!(await checkAccount(chainId))) return
    if (!config.address) {
      CONTRACT_ERR.configNotFound()
      return
    }

    writeContract({
      ...config,
      functionName: 'burnToken',
      args: [id],
    })
  }

  useEffect(() => setIsCalimingAirdrop(isBurning), [isBurning])

  return {
    isBurning,
    burn,
  }
}
