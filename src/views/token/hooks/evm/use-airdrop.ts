import { useEffect } from 'react'
import { useWriteContract } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Address, zeroAddress } from 'viem'

import { CONTRACT_ERR } from '@/errors/contract'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { useCheckAccount } from '@/hooks/use-check-chain'
import { useAudioPlayer } from '@/hooks/use-audio-player'
import {
  distributorAbiMap,
  DistributorVersion,
} from '@/contract/abi/distributor'
import { useAirdropStore } from '@/stores/use-airdrop'

export const useAirdrop = (
  id: bigint,
  chainId: number,
  version: DistributorVersion | undefined,
  contract: string | undefined,
  onFinally?: () => void
) => {
  const { t } = useTranslation()
  const { playFire } = useAudioPlayer()
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
      onMutate: () => toast.loading(t('claiming')),
      onSettled: (_, __, ___, id) => toast.dismiss(id),
      onError: ({ message }) => {
        reset()
        CONTRACT_ERR.message(message)
      },
      onSuccess: playFire,
    },
  })
  const { isLoading } = useWaitForTx({
    hash,
    onLoading: () => toast.loading(t('tx.waiting')),
    onError: () => toast.error(t('airdrop.claim.failed')),
    onSuccess: () => toast.success(t('airdrop.claim.success')),
    onFinally: () => {
      reset()
      onFinally?.()
      toast.dismiss()
    },
  })
  const isClaiming = isPending || isLoading

  const checkForClaim = async () => {
    if (!(await checkAccount(chainId))) return false
    if (!contract) {
      CONTRACT_ERR.configNotFound()
      return false
    }

    return true
  }

  const claimKol = async (kolId = 0) => {
    if (!(await checkForClaim())) return

    writeContract({
      ...config,
      functionName: 'claimKol',
      args: [BigInt(id!), BigInt(kolId)],
    })
  }

  const claimCommunity = async (
    exchangeId = 0,
    nftId: Address = zeroAddress,
    tokenId: Address = zeroAddress
  ) => {
    if (!(await checkForClaim())) return

    writeContract({
      ...config,
      functionName: 'claimCommunity',
      args: [BigInt(id!), BigInt(exchangeId), nftId, tokenId],
    })
  }

  useEffect(() => setIsCalimingAirdrop(isClaiming), [isClaiming])

  return {
    isClaiming,
    claimKol,
    claimCommunity,
  }
}
