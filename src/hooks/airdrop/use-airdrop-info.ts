import { useMemo } from 'react'
import { useReadContract } from 'wagmi'
import { Address, formatEther } from 'viem'
import { BigNumber } from 'bignumber.js'
import { useInterval } from 'ahooks'

import { BI_ZERO } from '@/constants/number'
import { bcAbiMap, BcVersion } from '@/contract/abi/bonding-curve'
import {
  distributorAbiMap,
  DistributorVersion,
} from '@/contract/abi/distributor'
import { tokenAbiMap, TokenVersion } from '@/contract/abi/token'
import { AirdropFlag } from '@/enums/airdrop'

interface Options {
  airdropId: number
  chainId: number
  airdropVersion: DistributorVersion
  airdropAddr: string
  bcVersion: BcVersion
  bcAddr: string
  tokenVersion: TokenVersion
  tokenAddr: string
}

export const useAirdropInfo = ({
  airdropId,
  chainId,
  airdropVersion,
  airdropAddr,
  bcVersion,
  bcAddr,
  tokenVersion,
  tokenAddr,
}: Partial<Options>) => {
  const isCorrectId = typeof airdropId === 'number'
  const distributorConfig = {
    abi: distributorAbiMap[airdropVersion!],
    address: airdropAddr as Address,
    chainId,
  }

  const { data: ratio = BI_ZERO } = useReadContract({
    abi: bcAbiMap[bcVersion!],
    address: bcAddr as Address,
    chainId,
    functionName: 'airdropRate_',
    // query: { enabled: !!bcAddr && isCorrectId },
    query: {
      enabled: false,
    },
  })
  const { data: totalSupply = '0' } = useReadContract({
    abi: tokenAbiMap[tokenVersion!],
    address: tokenAddr as Address,
    chainId,
    functionName: 'totalSupply',
    query: {
      // enabled: !!tokenAddr && isCorrectId,
      enabled: false,
      select: (data) => formatEther(data),
    },
  })

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
    args: [BigInt(airdropId ?? -1)],
    query: {
      // enabled: !!airdropAddr && isCorrectId
      enabled: false,
    },
  })

  const [
    ,
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

  const { airdropRatio, airdropTotal } = useMemo(() => {
    const airdropRatio = BigNumber(ratio.toString()).div(100).div(100).toFixed()
    const airdropTotal = BigNumber(airdropRatio)
      .multipliedBy(totalSupply)
      .toFixed()
    return { airdropTotal, airdropRatio }
  }, [ratio, totalSupply])

  // TODO: may need to `refetchDetails`, but it will refresh the page
  // useInterval(refetchAirdrop, 5_000)

  return {
    hasKolAirdrop,
    hasCommunityAirdrop,
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
    perKolAmount,
    perCommunityAmount,
    isLoadingInfo,
    refetchAirdrop,
  }
}
