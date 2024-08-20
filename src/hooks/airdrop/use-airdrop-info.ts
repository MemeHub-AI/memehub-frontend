import { useMemo } from 'react'
import { useReadContract } from 'wagmi'
import { formatEther } from 'viem'
import { BigNumber } from 'bignumber.js'
import { useInterval } from 'ahooks'

import { BI_ZERO } from '@/constants/number'
import { bcAbiMap } from '@/contract/abi/bonding-curve'
import { distributorAbiMap } from '@/contract/abi/distributor'
import { useTokenDetails } from '../use-token-details'
import { TokenVersion } from '@/contract/abi/token'
import { AirdropFlag } from '@/enums/airdrop'

export const useAirdropInfo = (
  id: number | undefined,
  token: string | undefined,
  chainId: number,
  tokenVersion: TokenVersion | undefined
) => {
  const {
    airdropAddr,
    airdropVersion,
    bcAddr,
    bcVersion,
    totalSupply,
    isLoadingDetails,
    refetchDetails,
  } = useTokenDetails(token, chainId, tokenVersion)
  const distributorConfig = {
    abi: distributorAbiMap[airdropVersion!],
    address: airdropAddr,
    chainId,
  }
  const isCorrectId = typeof id === 'number'

  const { data: duration = BI_ZERO } = useReadContract({
    ...distributorConfig,
    functionName: 'duration',
    query: { enabled: !!airdropAddr && isCorrectId },
  })
  const durationSeconds = Number(duration)

  const {
    data: airdropInfo = [],
    isLoading: isLoadingInfo,
    refetch: refetchAirdrop,
  } = useReadContract({
    ...distributorConfig,
    functionName: 'distributions',
    args: [BigInt(id || -1)],
    query: { enabled: !!airdropAddr && isCorrectId },
  })
  const [
    tokenAddr,
    kolCount = 0,
    communityCount = 0,
    kolClaimedCount = 0,
    communityClaimedCount = 0,
    startTime = BI_ZERO,
    kolFlag = AirdropFlag.None,
    communityFlag = AirdropFlag.None,
    kolAmount = BI_ZERO,
    communityAmount = BI_ZERO,
  ] = airdropInfo
  const perKolAmount = formatEther(kolAmount)
  const perCommunityAmount = formatEther(communityAmount)
  const createAt = Number(startTime)
  const hasKolAirdrop = kolFlag !== AirdropFlag.None
  const hasCommunityAirdrop = communityFlag !== AirdropFlag.None

  const { data: ratio = BI_ZERO } = useReadContract({
    abi: bcAbiMap[bcVersion!],
    address: bcAddr,
    chainId,
    functionName: 'airdropRate_',
    query: { enabled: !!bcAddr && isCorrectId },
  })
  const { airdropRatio, airdropTotal } = useMemo(() => {
    const airdropRatio = BigNumber(ratio.toString()).div(100).div(100).toFixed()
    const airdropTotal = BigNumber(airdropRatio)
      .multipliedBy(totalSupply)
      .toFixed()
    return { airdropTotal, airdropRatio }
  }, [ratio, totalSupply])

  const [
    kolTotalAmount,
    communityTotalAmount,
    kolClaimedAmount,
    communityClaimedAmount,
  ] = useMemo(
    () => [
      BigNumber(kolCount).multipliedBy(perKolAmount).toFixed(),
      BigNumber(communityCount).multipliedBy(perCommunityAmount).toFixed(),
      BigNumber(kolClaimedCount).multipliedBy(perKolAmount).toFixed(),
      BigNumber(communityClaimedCount)
        .multipliedBy(perCommunityAmount)
        .toFixed(),
    ],
    [
      kolCount,
      perKolAmount,
      communityCount,
      perCommunityAmount,
      communityClaimedCount,
    ]
  )

  // TODO: may need to `refetchDetails`, but it will refresh the page
  useInterval(refetchAirdrop, 5_000)

  return {
    hasKolAirdrop,
    hasCommunityAirdrop,
    tokenAddr,
    kolCount,
    communityCount,
    kolClaimedCount,
    communityClaimedCount,
    kolFlag,
    communityFlag,
    kolAmount,
    communityAmount,
    airdropRatio,
    airdropTotal,
    createAt,
    durationSeconds,
    kolTotalAmount,
    communityTotalAmount,
    kolClaimedAmount,
    communityClaimedAmount,
    isLoadingDetails,
    isLoadingInfo,
    refetchAirdrop,
  }
}
