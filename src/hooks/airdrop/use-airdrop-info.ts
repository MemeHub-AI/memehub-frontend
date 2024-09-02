import { useMemo } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { Address, formatEther, zeroAddress } from 'viem'

import {
  distributorAbiMap,
  DistributorVersion,
} from '@/contract/abi/distributor'
import { AirdropFlag } from '@/enums/airdrop'
import { BI_ZERO } from '@/constants/number'

export const useAirdropInfo = (
  id: bigint,
  chainId: number,
  version: DistributorVersion | undefined,
  contract: string | undefined
) => {
  const { address } = useAccount()

  const {
    data: {
      startTime = BI_ZERO,
      // @ts-ignore
      duration = BI_ZERO,
      amountPerClaimKOL = BI_ZERO,
      amountPerClaimCommunity = BI_ZERO,
      kolFlag = AirdropFlag.None,
      CommunityFlag = AirdropFlag.None,
      walletCountKOL = 0,
      walletCountCommunity = 0,
      claimedCountKOL = 0,
      claimedCountCommunity = 0,
      // @ts-ignore
      isClaimedKOL = false,
      // @ts-ignore
      isClaimedCommunity = false,
      // @ts-ignore
      isBurn: isBurned = false,
    } = {},
    refetch: refetchInfo,
  } = useReadContract({
    abi: distributorAbiMap[version!],
    address: contract as Address,
    chainId,
    functionName: 'getDistributions',
    args: [[id], address || zeroAddress],
    query: {
      enabled: !!contract && !!version,
      select: (data) => data[0],
    },
  })
  const createAt = Number(startTime)
  const durationSeconds = Number(duration)
  const perKolAmount = formatEther(amountPerClaimKOL)
  const perCommunityAmount = formatEther(amountPerClaimCommunity)
  const hasKolAirdrop = kolFlag !== AirdropFlag.None
  const hasCommunityAirdrop = CommunityFlag !== AirdropFlag.None

  const isOnlyOne = useMemo(() => {
    let count = 0
    if (hasKolAirdrop) count++
    if (hasCommunityAirdrop) count++
    return count === 1
  }, [hasKolAirdrop, hasCommunityAirdrop])

  return {
    isOnlyOne,
    hasKolAirdrop,
    hasCommunityAirdrop,
    createAt,
    durationSeconds,
    perKolAmount,
    perCommunityAmount,
    claimedCountKOL,
    claimedCountCommunity,
    walletCountKOL,
    walletCountCommunity,
    isClaimedKOL,
    isClaimedCommunity,
    isBurned,
    refetchInfo,
  }
}
