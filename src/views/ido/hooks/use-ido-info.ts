import { useMemo } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { formatEther } from 'viem'
import { BigNumber } from 'bignumber.js'
import { useInterval } from 'ahooks'

import { BI_ZERO } from '@/constants/number'
import { idoAbi } from '@/contract/abi/ido/ido'
import { addrMap } from '@/contract/address'
import { useIdoClaimed } from './use-ido-claimed'

export enum IdoStatus {
  Active,
  Ended,
  Canceled,
}

export const useIdoInfo = (chainId: number, poolId: number) => {
  const { address } = useAccount()
  const { ido } = addrMap[chainId] ?? {}

  const { isClaimedReserve, refetchClaimedReserve } = useIdoClaimed(
    chainId,
    poolId
  )

  const {
    data: userInfo = [],
    isLoading: isLoadingUserInfo,
    refetch: refetchUserInfo,
  } = useReadContract({
    abi: idoAbi,
    address: ido!,
    chainId,
    functionName: 'getUserInfo',
    args: [BigInt(poolId), address!],
    query: { enabled: !!ido && !!address },
  })
  const [deposit = BI_ZERO, weight = BI_ZERO] = userInfo
  const userAmount = formatEther(deposit)

  const { data: initUserWeight = BI_ZERO } = useReadContract({
    abi: idoAbi,
    address: ido!,
    chainId,
    functionName: 'getUserWeight',
    args: [address!, [], BigInt(0)],
    query: { enabled: !!address && !!ido },
  })
  const userWeight = BigNumber(userAmount).isZero()
    ? initUserWeight.toString()
    : weight.toString()
  const isCommunityMember = BigNumber(userWeight).gt(0)

  const {
    data: pools = [],
    isLoading: isLoadingPools,
    refetch: refetchPools,
  } = useReadContract({
    abi: idoAbi,
    address: ido!,
    chainId,
    functionName: 'pools',
    args: [BigInt(poolId)],
    query: { enabled: !!ido, refetchInterval: 10_000 },
  })
  const [
    tokenAddress,
    tokenAmount,
    status = 0,
    startAt = 0,
    endAt = 0,
    perUserLimit = BI_ZERO,
    ethBalance = BI_ZERO,
    totalEthAmount = BI_ZERO,
    weightSum = BI_ZERO,
    raisedEthAmount = BI_ZERO,
  ] = pools
  const isActive = status === IdoStatus.Active
  const isEnded = status === IdoStatus.Ended
  const isCanceled = status === IdoStatus.Canceled
  const totalWeight = formatEther(weightSum)
  const currentReserveAmount = formatEther(ethBalance)
  const totalReserveAmount = formatEther(totalEthAmount)
  const raisedReserveAmount = formatEther(raisedEthAmount)
  const userMax = formatEther(perUserLimit)
  const userRemaining = BigNumber(userMax).minus(userAmount).toFixed()

  // claimed: deposit / totalEthAmount * 100
  // unclaimed: deposit * weight / weightSum
  const userQuota = isClaimedReserve
    ? BigNumber(userAmount).div(totalReserveAmount).multipliedBy(100).toFixed(2)
    : BigNumber(userAmount).multipliedBy(userWeight).div(totalWeight).toFixed(2)

  const progress = useMemo(() => {
    const p = BigNumber(raisedReserveAmount)
      .div(totalReserveAmount)
      .multipliedBy(100)
    return p.isNaN() ? 0 : p.toFixed(2)
  }, [pools])

  const refetchIdoInfo = () => {
    refetchUserInfo()
    refetchPools()
    refetchClaimedReserve()
  }

  useInterval(refetchIdoInfo, 10_000)

  return {
    isLoadingUserInfo,
    isLoadingPools,
    refetchIdoInfo,
    pools,
    tokenAddress,
    tokenAmount,
    status,
    isActive,
    isEnded,
    isCanceled,
    startAt,
    endAt,
    userAmount,
    userWeight,
    userQuota,
    currentReserveAmount,
    totalReserveAmount,
    raisedReserveAmount,
    progress,
    userMax,
    userRemaining,
    isCommunityMember,
  }
}
