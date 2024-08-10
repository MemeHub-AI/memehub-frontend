import { useEffect } from 'react'
import { useReadContract, useWriteContract } from 'wagmi'
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
  id: number | undefined,
  addr: string | undefined,
  version: DistributorVersion | undefined,
  chainId: number | undefined,
  onFinally?: () => void
) => {
  id = id || 0 // adapt id is null
  const { t } = useTranslation()
  const { playFire } = useAudioPlayer()
  const { address, checkForChain, checkForConnect } = useCheckAccount()
  const { setIsCalimingAirdrop } = useAirdropStore()

  const airdropConfig = {
    abi: distributorAbiMap[version!],
    address: addr as Address,
    chainId,
  }

  const query = {
    enabled: !!id && !!address && !!addr && !!chainId,
    refetchInterval: 5_000,
  }

  const { data: isKolClaimed = false, refetch: refetchKolClaimed } =
    useReadContract({
      ...airdropConfig,
      functionName: 'isClaimedKOL',
      args: [BigInt(id), address!],
      query,
    })

  const { data: isCommunityClaimed = false, refetch: refetchCommunityCalimed } =
    useReadContract({
      ...airdropConfig,
      functionName: 'isClaimedCommunity',
      args: [BigInt(id), address!],
      query,
    })

  const refetch = () => {
    refetchKolClaimed()
    refetchCommunityCalimed()
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
    onFillay: () => {
      reset()
      refetch()
      onFinally?.()
      toast.dismiss()
    },
  })
  const isClaiming = isPending || isLoading

  const checkForClaim = async () => {
    if (!checkForConnect()) return false
    if (!(await checkForChain(chainId))) return false
    if (!addr) {
      CONTRACT_ERR.configNotFound()
      return false
    }

    return true
  }

  const claimKol = async (kolId = 0) => {
    if (!(await checkForClaim())) return

    writeContract({
      ...airdropConfig,
      functionName: 'claimKol',
      args: [BigInt(id), BigInt(kolId)],
    })
  }

  const claimCommunity = async (
    exchangeId = 0,
    nftId: Address = zeroAddress,
    tokenId: Address = zeroAddress
  ) => {
    if (!(await checkForClaim())) return

    writeContract({
      ...airdropConfig,
      functionName: 'claimCommunity',
      args: [BigInt(id), BigInt(exchangeId), nftId, tokenId],
    })
  }

  useEffect(() => setIsCalimingAirdrop(isClaiming), [isClaiming])

  return {
    isClaiming,
    isKolClaimed,
    isCommunityClaimed,
    claimKol,
    claimCommunity,
    resetClaim: reset,
  }
}
