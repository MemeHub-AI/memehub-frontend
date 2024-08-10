import { useReadContract } from 'wagmi'
import { formatEther } from 'viem'
import { BigNumber } from 'bignumber.js'
import { useInterval } from 'ahooks'

import { BI_ZERO } from '@/constants/number'
import { bcAbiMap } from '@/contract/abi/bonding-curve'
import { distributorAbiMap } from '@/contract/abi/distributor'
import { useTokenDetails } from '../use-token-details'
import { TokenVersion } from '@/contract/abi/token'

export const useAirdropInfo = (
  id: number | undefined,
  token: string | undefined,
  chainId: number,
  tokenVersion: TokenVersion | undefined
) => {
  id = id || 0

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

  const { data: duration = BI_ZERO } = useReadContract({
    ...distributorConfig,
    functionName: 'duration',
    query: { enabled: !!airdropAddr && !!id },
  })
  const durationSeconds = Number(duration)

  const {
    data: airdropInfo = [],
    isLoading: isLoadingInfo,
    refetch: refetchInfo,
  } = useReadContract({
    ...distributorConfig,
    functionName: 'distributions',
    args: [BigInt(id)],
    query: { enabled: !!airdropAddr && !!id },
  })
  const [
    tokenAddr,
    kolCount = 0,
    communityCount = 0,
    kolClaimedCount = 0,
    communityClaimedCount = 0,
    startTime = BI_ZERO,
    kolFlag, // AirdropType
    communityFlag, // AirdropType
    kolAmount = BI_ZERO,
    communityAmount = BI_ZERO,
  ] = airdropInfo
  const perKolAmount = formatEther(kolAmount)
  const perCommunityAmount = formatEther(communityAmount)
  const createAt = Number(startTime)
  const hasKolAirdrop = kolCount !== 0
  const hasCommunityAirdrop = communityCount !== 0

  const { data: ratio = BI_ZERO } = useReadContract({
    abi: bcAbiMap[bcVersion!],
    address: bcAddr,
    chainId,
    functionName: 'airdropRate_',
    query: { enabled: !!bcAddr && !!id },
  })
  const airdropRatio = BigNumber(ratio.toString()).div(100).div(100).toFixed()
  const totalAirdrop = BigNumber(airdropRatio)
    .multipliedBy(totalSupply)
    .toFixed()
  const kolTotalAmount = BigNumber(totalAirdrop)
    .minus(BigNumber(kolCount).multipliedBy(perKolAmount))
    .toFixed()
  const communityTotalAmount = BigNumber(totalAirdrop)
    .minus(BigNumber(communityCount).multipliedBy(perCommunityAmount))
    .toFixed()
  const kolClaimedAmount = BigNumber(kolClaimedCount)
    .multipliedBy(perKolAmount)
    .toFixed()
  const communityClaimedAmount = BigNumber(communityClaimedCount)
    .multipliedBy(perCommunityAmount)
    .toFixed()

  const refetchAirdrop = () => {
    refetchInfo()
    refetchDetails()
  }

  console.log('count', kolCount, communityCount)

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
    totalAirdrop,
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
