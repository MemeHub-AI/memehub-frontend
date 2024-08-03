import { useReadContract, useWriteContract } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { CONTRACT_ERR } from '@/errors/contract'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { useCheckAccount } from '@/hooks/use-check-chain'
import { useAudioPlayer } from '@/hooks/use-audio-player'
import {
  distributorAbiMap,
  DistributorAbiVersion,
} from '@/contract/abi/distributor'
import { useTokenContext } from '@/contexts/token'
import { Address, zeroAddress } from 'viem'

export const useAirdrop = (id: number) => {
  const { t } = useTranslation()
  const { playFire } = useAudioPlayer()
  const { address, checkForChain, checkForConnect } = useCheckAccount()
  const { chainId, airdropVersion, airdropAddr } = useTokenContext()

  const airdropConfig = {
    abi: distributorAbiMap[airdropVersion as DistributorAbiVersion],
    address: airdropAddr!,
    chainId,
  }

  const { data: isKolClaimed = false, refetch: refetchKolClaimed } =
    useReadContract({
      ...airdropConfig,
      functionName: 'isClaimedKOL',
      args: [BigInt(id), address!],
      query: { enabled: !!address && !!airdropAddr },
    })

  const { data: isCommunityClaimed = false, refetch: refetchCommunityCalimed } =
    useReadContract({
      ...airdropConfig,
      functionName: 'isClaimedCommunity',
      args: [BigInt(id), address!],
      query: { enabled: !!address && !!airdropAddr },
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
      toast.dismiss()
    },
  })

  const checkForClaim = async () => {
    if (!checkForConnect()) return false
    if (!(await checkForChain(chainId))) return false
    if (!airdropAddr) {
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

  // const { data: isBurn, refetch: refetchIsBurn } = useReadContract({
  //   abi: distributorAbiMap['0.1.0'], // TODO: match version
  //   address: distributor,
  //   functionName: 'isBurn',
  //   args: [BigInt(id)],
  //   chainId,
  //   query: {
  //     refetchInterval: 5_000,
  //   },
  // })

  // const burn = async () => {
  //   if (!checkForConnect()) return

  //   const isValidChain = await checkForChain(chainId)
  //   if (!isValidChain || !distributor) return

  //   setBurning(true)
  //   // TODO: should simulate first.
  //   writeContract({
  //     abi: distributorAbiMap['0.1.0'],
  //     address: distributor,
  //     functionName: 'burnToken',
  //     chainId,
  //     args: [BigInt(id)],
  //   })
  // }

  return {
    isClaiming: isPending || isLoading,
    isKolClaimed,
    isCommunityClaimed,
    claimKol,
    claimCommunity,
    resetClaim: reset,
  }
}
